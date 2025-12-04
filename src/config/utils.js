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

  // convert centimeters to feet/inches
  static cmToFeetInches = (cm) => {
    if (cm === null || cm === undefined) return null;
    const totalInches = cm / 2.54;
    let feet = Math.floor(totalInches / 12);
    let inches = Math.round(totalInches - feet * 12);
    if (inches === 12) {
      feet += 1;
      inches = 0;
    }
    return { feet, inches };
  };

  // clamp percent values between 0 and 100
  static clampPercent = (val) => Math.min(100, Math.max(0, Math.round(val)));

  // calculate goal progress percentage prioritizing weight-based goals (1RM/max)
  static calculateGoalPercent(goal, progress) {
    if (!goal || !progress) return 0;
    // targetWeight may be stored under different keys depending on goal creation
    const targetWeight =
      goal.target_weight || goal.targetWeight || goal.playerWeight || goal.playerReps;
    const { actual_weight, actual_time } = progress;

    if (targetWeight && actual_weight) {
      return Utils.clampPercent((actual_weight / targetWeight) * 100);
    }
    if (goal.playerTime && actual_time) {
      // faster time is better: target / actual
      return Utils.clampPercent((goal.playerTime / actual_time) * 100);
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
