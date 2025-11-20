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
import ExerciseDetails from "./views/ExerciseDetails.vue"

// Plans & Goals
import AddExercisePlan from "./views/AddExercisePlan.vue";
import EditExercisePlan from "./views/EditExercisePlan.vue";
import ExerciseGoals from "./views/ExerciseGoals.vue";
import Progress from "./views/Progress.vue";
import Catalog from "./views/Catalog.vue";
import TeamDetails from "./views/TeamDetails.vue";

//Teams views - Player & coach 
import Teams from "./views/Teams.vue"

import ViewAthletes from "./views/ViewAthletes.vue";
import AthleteLessons from "./views/AthleteLessons.vue";
import AthleteWorkout from "./views/AthleteWorkout.vue";
import LessonDetails from "./views/LessonDetails.vue";



import Utils from "./config/utils";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //Startup
    { path: "/", redirect: "/start" },
    { path: "/start", name: "start", component: LoginStart },
    { path: "/select-role", name: "selectRole", component: SelectRole },
    { path: "/google-auth", name: "googleAuth", component: GoogleAuth },

    //Coach Routes
    { path: "/coach", name: "coachDashboard", component: CoachDashboard },
    { path: "/athletes", name: "viewAthletes", component: ViewAthletes },
    { path: "/catalog", name: "catalog", component: Catalog },
    { 
      path: "/lesson/:id", name: "lessonDetails", component: LessonDetails, props: true 
    },
    {
      path: "/lesson/:id_lesson/exercise/:id_exercise", name: "exerciseDetails", component: ExerciseDetails, props: true,
    },

    //Athlete Routes
    { path: "/athlete", name: "athleteDashboard", component: AthleteDashboard },
    { path: "/teams", name: "teams", component: Teams},
    { path: "/teams/:id", name: "teamDetails", component: TeamDetails, props: true},
    { path: "/workout", name: "workout", component: AthleteLessons, props: true},
    { path: "/workout/:id_lesson", name: "athleteWorkout", component: AthleteWorkout, props: true},

    //Ambigous - Coach's & Players can view it
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
  next(); // Always allow navigation
});


export default router;

