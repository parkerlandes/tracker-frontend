export default class Utils {
  /** ---------------- Storage helpers ---------------- */
  // set local storage
  static setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== "string") {
      content = JSON.stringify(content);
    }
    return window.localStorage.setItem(name, content);
  };
  
  // get local storage
  static getStore = (name) => {
    if (!name) return null;
    const value = window.localStorage.getItem(name);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };

  // remove item
  static removeItem = (name) => {
    if (!name) return;
    return window.localStorage.removeItem(name);
  };

  // validate email
  static isValidEmail = (value) => {
    return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i.test(value)
      ? false
      : true;
  };

  /* ---------------- Unit helpers ---------------- */
  // convert kilograms to pounds (rounded)
  static kgToLbs = (kg) => {
    if (kg === null || kg === undefined) return null;
    return Math.round(kg * 2.20462);
  };

  // clamp percent values between 0 and 100
  static clampPercent = (val) => Math.min(100, Math.max(0, Math.round(val)));

  // calculate goal progress percentage for reps/time-based goals
  static calculateGoalPercent(goal, progress) {
    if (!goal || !progress) return 0;
    const { playerReps, playerTime } = goal;
    const { actual_reps, actual_time } = progress;

    if (playerReps && actual_reps) {
      return Utils.clampPercent((actual_reps / playerReps) * 100);
    }
    if (playerTime && actual_time) {
      // faster time is better: target / actual
      return Utils.clampPercent((playerTime / actual_time) * 100);
    }
    return 0;
  }

  /** ---------------- Sorting helpers ---------------- */
  // sort items by recorded_at descending; returns a new array
  static sortByRecordedAtDesc(items) {
    return [...(items || [])].sort(
      (a, b) => new Date(b?.recorded_at || 0) - new Date(a?.recorded_at || 0)
    );
  }

  /* ---------------- Data fetch helpers ---------------- */
  // These helpers centralize service calls; callers handle errors.
  static async fetchUserMetrics(userId, services) {
    if (!userId || !services?.progress) return [];
    const { data } = await services.progress.getUserMetrics(userId);
    return data || [];
  }

  static async fetchUserGoals(userId, services) {
    if (!userId || !services?.goals) return [];
    const { data } = await services.goals.getUserGoals(userId);
    return data || [];
  }

  static async fetchGoalProgress(goalId, services) {
    if (!goalId || !services?.goalProgress) return [];
    const { data } = await services.goalProgress.getProgressForGoal(goalId);
    return Utils.sortByRecordedAtDesc(data);
  }

  /** ---------------- Navigation helpers ---------------- */
  static navigate(router, route) {
    if (router && route) {
      router.push(route);
    }
  }
}