import { createRouter, createWebHistory } from "vue-router";

import LoginStart from "./views/LoginStart.vue";
import SelectRole from "./views/SelectRole.vue";
import GoogleAuth from "./views/GoogleAuth.vue";

import CoachDashboard from "./views/CoachDashboard.vue";
import AthleteDashboard from "./views/AthleteDashboard.vue";

// Exercises
import ExerciseList from "./views/ExerciseList.vue";
import AddExercise from "./views/AddExercise.vue";
import EditExercise from "./views/EditExercise.vue";
import ViewExercise from "./views/ViewExercise.vue";

// Plans & Goals
import AddExercisePlan from "./views/AddExercisePlan.vue";
import EditExercisePlan from "./views/EditExercisePlan.vue";
import ExerciseGoals from "./views/ExerciseGoals.vue";
import Progress from "./views/Progress.vue";

import Utils from "./config/utils";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/start" },
    { path: "/start", name: "start", component: LoginStart },
    { path: "/select-role", name: "selectRole", component: SelectRole },
    { path: "/google-auth", name: "googleAuth", component: GoogleAuth },
    { path: "/coach", name: "coachDashboard", component: CoachDashboard },
    { path: "/athlete", name: "athleteDashboard", component: AthleteDashboard },
    { path: "/exercises", name: "exerciseList", component: ExerciseList },
    { path: "/exercise/add", name: "addExercise", component: AddExercise },
    { path: "/exercise/edit/:id", name: "editExercise", component: EditExercise, props: true },
    { path: "/exercise/:id", name: "viewExercise", component: ViewExercise, props: true },
    { path: "/plans/add", name: "addExercisePlan", component: AddExercisePlan },
    { path: "/plans/edit/:id", name: "editExercisePlan", component: EditExercisePlan, props: true },
    { path: "/goals", name: "goals", component: ExerciseGoals },
    { path: "/progress", name: "progress", component: Progress },
    { path: "/profile", name: "athleteProfile", component: () => import("./views/AthleteProfile.vue") },

  ],
});

router.beforeEach((to, from, next) => {
  next(); // ✅ Always allow navigation
});


export default router;


