import { createRouter, createWebHistory } from "vue-router";

import LoginStart from "./views/LoginStart.vue";
import SelectRole from "./views/SelectRole.vue";
import GoogleAuth from "./views/GoogleAuth.vue";

import CoachDashboard from "./views/CoachDashboard.vue";
import AthleteDashboard from "./views/AthleteDashboard.vue";

// ATHLETES
import ViewAthletes from "./views/ViewAthletes.vue";

import AthleteProfile from "./views/AthleteProfile.vue";

// EXERCISES
import ExerciseList from "./views/ExerciseList.vue";
import AddExercise from "./views/AddExercise.vue";
import EditExercise from "./views/EditExercise.vue";
import ViewExercise from "./views/ViewExercise.vue";
import ExerciseDetails from "./views/ExerciseDetails.vue"

// PLANS & LESSONS
import AddExercisePlan from "./views/AddExercisePlan.vue";
import EditExercisePlan from "./views/EditExercisePlan.vue";
import Catalog from "./views/Catalog.vue";
import LessonDetails from "./views/LessonDetails.vue";

// GOALS
import ExerciseGoals from "./views/ExerciseGoals.vue";
import Progress from "./views/Progress.vue";

// TEAMS
import Teams from "./views/Teams.vue";
import TeamDetails from "./views/TeamDetails.vue";

// ATHLETE WORKOUT
import AthleteLessons from "./views/AthleteLessons.vue";
import AthleteWorkout from "./views/AthleteWorkout.vue";

import Utils from "./config/utils";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    // STARTUP
    { path: "/", redirect: "/start" },
    { path: "/start", component: LoginStart },
    { path: "/select-role", component: SelectRole },
    { path: "/google-auth", component: GoogleAuth },

    // COACH DASHBOARD
    { path: "/coach", component: CoachDashboard },

    // COACH — ATHLETE MGMT
    { path: "/coach/athletes", component: ViewAthletes },
    { path: "/coach/athlete/:id", component: AthleteProfile, props: true },
    { 
      path: "/coach/teams",
      name: "coachTeams",
      component: () => import("./views/Teams.vue"),
    },

    // COACH — EXERCISES
    { path: "/coach/exercises", component: ExerciseList },
    { 
      path: "/coach/lesson/:id_lesson/exercise/add",
      component: AddExercise,
      props: true 
    },
    { path: "/coach/exercise/edit/:id", component: EditExercise, props: true },
    { path: "/coach/exercise/:id", component: ViewExercise, props: true },
    {
      path: "/coach/exercises",
      name: "allExercises",
      component: () => import("./views/AllExercises.vue"),
    },

    // COACH — EXERCISE PLANS
    { path: "/coach/plans", component: Catalog },
    { path: "/coach/plans/add", component: AddExercisePlan },
    { path: "/coach/plans/edit/:id", component: EditExercisePlan, props: true },

    // COACH — GOALS & PROGRESS
    {
      path: "/coach/goals",
      component: () => import("./views/CoachGoals.vue"),
    },
    { 
      path: "/coach/goals/create",
      component: () => import("./views/CreatePlayerGoal.vue"),
    },
    {
      path: "/coach/progress",
      component: () => import("./views/CoachProgress.vue"),
    },
    

    
    { path: "/coach/progress", component: Progress },

    // COACH — LESSON DETAILS
    { 
      path: "/coach/lesson/:id_lesson",
      name: "lessonDetails",
      component: LessonDetails,
      props: true 
    },
    {
      path: "/coach/lesson/:id_lesson/exercise/:id_exercise",
      component: ExerciseDetails,
      props: true
    },
    
    

    // COACH — TEAMS
    { path: "/coach/teams", component: Teams },
    { path: "/coach/teams/:id", component: TeamDetails, props: true },

// ATHLETE DASHBOARD
{ path: "/athlete", component: AthleteDashboard },

// ATHLETE PROFILE
{ path: "/athlete/profile", component: AthleteProfile },

// ATHLETE TEAMS
{ 
  path: "/teams",
  name: "athleteTeams",
  component: () => import("./views/AthleteTeams.vue"),
},

{
  path: "/athlete/goals",
  component: () => import("./views/AthleteGoals.vue")
},

// ATHLETE PROGRESS
{ path: "/athlete/progress", component: Progress },

// ATHLETE — WORKOUT VIEWS
{ path: "/athlete/workouts", component: AthleteLessons },

    
  ],
});

// navigation guard can be enhanced later with RBAC
router.beforeEach((to, from, next) => {
  next();
});

export default router;
