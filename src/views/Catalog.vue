<script>
import Utils from "../config/utils.js";
import CoachNav from "../components/CoachNav.vue";
import LessonServices from "../services/lessonServices.js";
import MuscleGroupServices from "../services/muscleGroupsServices.js";
import UserServices from "../services/userServices.js";
import lessonServices from "../services/lessonServices.js";


export default {
  name: "LessonCatalog", 
  components: { CoachNav },

  data() {
    const user = Utils.getStore("user");

    return {
      user: user,
      isCoach: user?.role === "coach",

      lessons: [],
      loading: true,
      error: "",
      muscleGroups: [],
      athletes: [],

      showLessonModal: false,
      newLesson: {
        title: "",
        description: "",
        id_muscle_group: null,
        id_user: null,
      },

      // NEW:
      deleteDialog: false,
      lessonToDelete: null,

    };
  },

  methods: {

    async fetchLessons() {
      try {
        const res = await LessonServices.getLessons();

        this.lessons = res.data.map(lesson => ({
          id_lesson: lesson.id_lesson,
          title: lesson.title,
          description: lesson.description,
          muscleGroup: lesson.id_muscle_group,
          assignedUser: lesson.id_user
        }));
      } catch (err) {
        console.error("Error fetching lessons:", err);
        this.error = "Failed to load lessons.";
      }
    },

    async fetchMuscleGroups() {
      try {
        const res = await MuscleGroupServices.getGroups();

        this.muscleGroups = res.data.map(muscleGroup => ({
          id_muscle_group: muscleGroup.id_muscle_group,
          muscle: `${muscleGroup.muscle}`
        }));
      } catch (err) {
        console.error("Error fetching muscle groups:", err);
        this.error = "Failed to load muscle groups.";

        this.muscleGroups = [];
      }
    },

    async fetchAthletes() {
      try {
        const res = await UserServices.getAllUsers();

        this.athletes = res.data.map(user => ({
          id_user: user.id_user,    // ✔ FIXED
          name: `${user.fName} ${user.lName}`
        }));

      } catch (err) {
        console.error("Error fetching athletes:", err);
        this.athletes = [];
      }
    },

    deleteLesson(id_lesson) {
      if (!confirm("Are you sure you want to delete this lesson?")) return;

      lessonServices.deleteLesson(id_lesson)
        .then(() => {
          this.fetchLessons();
        })
        .catch(err => {
          console.error("Error deleting lesson:", err);
          alert("Failed to delete lesson.");
        });
    },

    confirmDelete(lesson) {
      this.lessonToDelete = lesson;
      this.deleteDialog = true;
    },

    async deleteLesson() {
      try {
        await lessonServices.deleteLesson(this.lessonToDelete.id_lesson);

        this.deleteDialog = false;
        this.lessonToDelete = null;

        await this.fetchLessons();
      } catch (err) {
        console.error("Error deleting lesson:", err);
        alert("Failed to delete lesson.");
      }
    },


    goToLesson(id_lesson) {
      this.$router.push({ name: "lessonDetails", params: { id_lesson } });
    },
    
    resetForm() {
      this.newLesson = {
        title: "",
        description: "",
        id_muscle_group: null,
        id_user: null,
      };
    },

    openModal() {
      this.resetForm(); 
      this.showLessonModal = true;
    },

    cancelLesson() {
      this.showLessonModal = false;
      this.resetForm(); 
    },

    async saveLesson() {
      if (!this.newLesson.title || !this.newLesson.id_muscle_group || !this.newLesson.id_user) {
        alert("Title, Muscle Group, and Athlete assignment are required fields!");
        return;
      }

      const lessonData = this.newLesson;
      try {
        await lessonServices.createLesson(lessonData);
        
        await this.fetchLessons();
        this.cancelLesson();
      } catch (err) {
        console.error("Error saving new lesson:", err);
        alert("Failed to save lesson. Check console for details.");
      }
    },
  },

  async deleteLesson(id_lesson) {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await lessonServices.deleteLesson(id_lesson);
      await this.fetchLessons();   // refresh list
    } catch (err) {
      console.error("Error deleting lesson:", err);
      alert("Failed to delete lesson.");
    }
  },

  async mounted() {
    this.loading = true;
    try {
      await this.fetchLessons();

      if (this.isCoach) {
        await Promise.all([
          this.fetchMuscleGroups(),
          this.fetchAthletes()
        ]);
      }
    } catch (error) {
      console.error("Initialization failed:", error);
      this.error = "Failed to load all component data.";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <v-app>
    <CoachNav v-if="isCoach" />
    <AthleteNav v-else /> 

    <v-container class="pa-8 mt-10">
      <h2 class="mb-6 text-center">Lesson Catalog</h2>
      
      <v-row v-if="isCoach" justify="end" class="mb-4">
        <v-col cols="auto">
          <v-btn color="success" @click="openModal" :disabled="loading">
            <v-icon left>mdi-plus-box</v-icon>
            Add Lesson
          </v-btn>
        </v-col>
      </v-row>

      <v-progress-circular 
        v-if="loading" 
        indeterminate 
        color="primary" 
        size="48"
        class="d-flex mx-auto my-6" 
      />
      
      <v-row v-else>
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="lesson in lessons"
          :key="lesson.id_lesson"
        >
          <v-card class="pa-6 text-center hoverable" elevation="4">
            <v-icon size="48" color="primary">mdi-book-open-page-variant</v-icon>
            <h3 class="mt-3">{{ lesson.title }}</h3>
            <p class="text-medium-emphasis">{{ lesson.description }}</p>

            <div class="mt-2">

              <!-- Assigned Athlete -->
              <v-chip 
                v-if="lesson.assignedUser"
                color="blue"
                small
                class="mr-1"
              >
                Athlete Assigned
              </v-chip>

              <!-- Muscle group -->
              <v-chip
                v-if="lesson.muscleGroup"
                color="green"
                small
                class="mr-1"
              >
                {{ muscleGroups.find(m => m.id_muscle_group === lesson.muscleGroup)?.muscle }}
              </v-chip>

            </div>
            <v-chip v-if="lesson.difficulty" color="secondary" label>
              {{ lesson.difficulty }}
            </v-chip> 

            <v-btn color="primary" class="mt-4" @click="goToLesson(lesson.id_lesson)">
              View Lesson
            </v-btn>

            <v-btn 
              color="error"
              class="mt-4 ml-2"
              @click="confirmDelete(lesson)"
            >
              <v-icon left>mdi-delete</v-icon>
              Delete
            </v-btn>

          </v-card>
        </v-col>
      </v-row>

      <v-alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </v-alert>
    </v-container>

    <v-dialog v-model="showLessonModal" max-width="600">
      <v-card>
        <v-card-title class="headline">Create and Assign New Lesson</v-card-title>
        <v-card-text>
          <v-container>
            
            <v-text-field
              v-model="newLesson.title"
              label="Lesson Title"
              required
            ></v-text-field>
            
            <v-select
              v-model="newLesson.id_user"
              :items="athletes"
              item-title="name"
              item-value="id_user"
              label="Assign Lesson To Athlete"
              required
            />
            
            <v-select
              v-model="newLesson.id_muscle_group"
              :items="muscleGroups"
              item-title="muscle" 
              item-value="id_muscle_group" 
              label="Target Muscle Group"
              :rules="[v => !!v || 'Muscle Group is required']"
              required
            ></v-select>
            
            <v-textarea
              v-model="newLesson.description"
              label="Description (Optional)"
              rows="3"
            ></v-textarea>
            
          </v-container>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="cancelLesson">Cancel</v-btn>
          <v-btn color="primary" @click="saveLesson">Save Lesson</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="pa-4">
        <v-card-title class="headline">
          Delete Lesson
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete 
          <strong>{{ lessonToDelete?.title }}</strong>?
          <br />
          This action cannot be undone.
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="tonal" color="grey" @click="deleteDialog = false">
            Cancel
          </v-btn>

          <v-btn variant="flat" color="error" @click="deleteLesson">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<style scoped>
.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease-in-out;
}
</style>
