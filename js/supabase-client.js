/**
 * games.utility.forum - Supabase Integration Client
 * Handles high scores, cloud save state, and player profiles.
 * Includes graceful localStorage fallback when Supabase keys are pending.
 *
 * Suggested Supabase SQL Tables:
 * 
 * CREATE TABLE public.leaderboards (
 *   id BIGSERIAL PRIMARY KEY,
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   game_id TEXT NOT NULL,
 *   player_name TEXT NOT NULL,
 *   score INTEGER NOT NULL,
 *   user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
 * );
 * 
 * CREATE TABLE public.game_saves (
 *   id BIGSERIAL PRIMARY KEY,
 *   updated_at TIMESTAMPTZ DEFAULT now(),
 *   user_id TEXT NOT NULL,
 *   game_id TEXT NOT NULL,
 *   save_data JSONB NOT NULL,
 *   UNIQUE(user_id, game_id)
 * );
 */

class SupabaseStorageService {
  constructor() {
    // Read from window config, localStorage, or fallback
    this.supabaseUrl = window.SUPABASE_URL || localStorage.getItem('guf_supabase_url') || '';
    this.supabaseAnonKey = window.SUPABASE_ANON_KEY || localStorage.getItem('guf_supabase_anon_key') || '';
    this.client = null;

    this.initClient();
  }

  initClient() {
    if (this.supabaseUrl && this.supabaseAnonKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
        console.log('[GUF] Supabase client initialized.');
      } catch (err) {
        console.warn('[GUF] Supabase initialization failed, falling back to local storage:', err);
      }
    }
  }

  isConfigured() {
    return !!(this.client);
  }

  // Get or generate a persistent local Guest ID
  getGuestId() {
    let id = localStorage.getItem('guf_guest_id');
    if (!id) {
      id = 'player_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('guf_guest_id', id);
    }
    return id;
  }

  // Get active player name
  getPlayerName() {
    return localStorage.getItem('guf_player_name') || this.getGuestId();
  }

  setPlayerName(name) {
    if (name && name.trim()) {
      localStorage.setItem('guf_player_name', name.trim());
    }
  }

  /**
   * Submit a high score to leaderboard
   */
  async submitScore(gameId, score, playerName = null) {
    const finalName = playerName || this.getPlayerName();
    const entry = {
      game_id: gameId,
      player_name: finalName,
      score: score,
      created_at: new Date().toISOString()
    };

    // Save locally first
    this.saveScoreLocal(gameId, entry);

    if (this.isConfigured()) {
      try {
        const { data, error } = await this.client
          .from('leaderboards')
          .insert([entry]);

        if (error) throw error;
        return { success: true, cloud: true, data };
      } catch (err) {
        console.warn('[GUF] Supabase score sync failed, cached locally:', err);
        return { success: true, cloud: false, localOnly: true };
      }
    }

    return { success: true, cloud: false, localOnly: true };
  }

  /**
   * Retrieve top scores for a game
   */
  async getLeaderboard(gameId, limit = 5) {
    if (this.isConfigured()) {
      try {
        const { data, error } = await this.client
          .from('leaderboards')
          .select('*')
          .eq('game_id', gameId)
          .order('score', { ascending: false })
          .limit(limit);

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[GUF] Fetching Supabase leaderboard failed, using local cache:', err);
      }
    }

    // Local fallback
    return this.getScoreLocal(gameId, limit);
  }

  /**
   * Save game state (inventory, level unlocked, stats)
   */
  async saveGameState(gameId, stateData) {
    const userId = this.getGuestId();
    const payload = {
      user_id: userId,
      game_id: gameId,
      save_data: stateData,
      updated_at: new Date().toISOString()
    };

    localStorage.setItem(`guf_save_${gameId}`, JSON.stringify(stateData));

    if (this.isConfigured()) {
      try {
        const { data, error } = await this.client
          .from('game_saves')
          .upsert([payload], { onConflict: 'user_id,game_id' });

        if (error) throw error;
        return { success: true, cloud: true, data };
      } catch (err) {
        console.warn('[GUF] Cloud state save failed, saved locally:', err);
      }
    }

    return { success: true, cloud: false };
  }

  /**
   * Load saved game state
   */
  async loadGameState(gameId) {
    if (this.isConfigured()) {
      try {
        const userId = this.getGuestId();
        const { data, error } = await this.client
          .from('game_saves')
          .select('save_data')
          .eq('user_id', userId)
          .eq('game_id', gameId)
          .maybeSingle();

        if (!error && data && data.save_data) {
          return data.save_data;
        }
      } catch (err) {
        console.warn('[GUF] Cloud state load failed, falling back to local:', err);
      }
    }

    const local = localStorage.getItem(`guf_save_${gameId}`);
    return local ? JSON.parse(local) : null;
  }

  // Local Storage Helpers
  saveScoreLocal(gameId, entry) {
    const key = `guf_scores_${gameId}`;
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push(entry);
    list.sort((a, b) => b.score - a.score);
    list = list.slice(0, 20);
    localStorage.setItem(key, JSON.stringify(list));
  }

  getScoreLocal(gameId, limit = 5) {
    const key = `guf_scores_${gameId}`;
    let list = JSON.parse(localStorage.getItem(key) || '[]');
    if (list.length === 0) {
      // Default demo scores so the leaderboard is never blank
      list = [
        { player_name: 'RetroPilot', score: 1240, created_at: new Date().toISOString() },
        { player_name: 'NeonGhost', score: 980, created_at: new Date().toISOString() },
        { player_name: 'CyberAce', score: 750, created_at: new Date().toISOString() }
      ];
    }
    return list.slice(0, limit);
  }
}

// Global Singleton Instance
window.gufStorage = new SupabaseStorageService();
