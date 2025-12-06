<script>
import Utils from "../config/utils.js";
import CoachNav from "../components/CoachNav.vue";
import AthleteNav from "../components/AthleteNav.vue";
import LessonServices from "../services/lessonServices.js";
import MuscleGroupServices from "../services/muscleGroupsServices.js";
import UserServices from "../services/userServices.js";
import lessonServices from "../services/lessonServices.js";
import userLessonServices from "../services/userLessonServices.js";

export default {
  name: "LessonCatalog",
  components: { CoachNav, AthleteNav },

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
        assignedUsers: [],
      },

      // NEW:
      deleteDialog: false,
      lessonToDelete: null,
      assignDialog: false,
      assignSelection: [],
      assignLesson: null,
    };
  },

  methods: {
    async fetchLessons() {
      try {
        const res = await LessonServices.getLessons();

        this.lessons = await Promise.all(
          res.data.map(async (lesson) => {
            try {
              const assignments = await userLessonServices.getForLesson(
                lesson.id_lesson
              );
              const assignedUsers = (assignments.data || []).map(
                (entry) => entry.user || entry
              );
              return {
                id_lesson: lesson.id_lesson,
                title: lesson.title,
                description: lesson.description,
                muscleGroup: lesson.id_muscle_group,
                assignedUsers,
                difficulty: lesson.difficulty,
              };
            } catch (err) {
              console.error(
                "Error fetching assignments for lesson",
                lesson.id_lesson,
                err
              );
              return {
                id_lesson: lesson.id_lesson,
                title: lesson.title,
                description: lesson.description,
                muscleGroup: lesson.id_muscle_group,
                assignedUsers: [],
                difficulty: lesson.difficulty,
              };
            }
          })
        );
      } catch (err) {
        console.error("Error fetching lessons:", err);
        this.error = "Failed to load lessons.";
      }
    },

    openAssignDialog(lesson) {
      this.assignLesson = lesson;
      this.assignSelection = lesson.assignedUsers?.map((u) => u.id_user) || [];
      this.assignDialog = true;
    },

    async saveAssignments() {
      if (!this.assignLesson) return;
      const id_lesson = this.assignLesson.id_lesson;
      const current = new Set(
        (this.assignLesson.assignedUsers || []).map((u) => u.id_user)
      );
      const next = new Set(this.assignSelection);

      const toAdd = [...next].filter((id) => !current.has(id));
      const toRemove = [...current].filter((id) => !next.has(id));

      try {
        await Promise.all([
          ...toAdd.map((id_user) =>
            userLessonServices.assign(id_user, id_lesson)
          ),
          ...toRemove.map((id_user) =>
            userLessonServices.remove(id_user, id_lesson)
          ),
        ]);
        // refresh assignments for this lesson
        const assignments = await userLessonServices.getForLesson(id_lesson);
        const assignedUsers = (assignments.data || []).map(
          (entry) => entry.user || entry
        );

        this.lessons = this.lessons.map((lesson) =>
          lesson.id_lesson === id_lesson ? { ...lesson, assignedUsers } : lesson
        );

        this.assignDialog = false;
        this.assignLesson = null;
        this.assignSelection = [];
      } catch (err) {
        console.error("Error saving assignments", err);
        alert("Failed to update assignments.");
      }
    },

    async fetchMuscleGroups() {
      try {
        const res = await MuscleGroupServices.getGroups();

        this.muscleGroups = res.data.map((muscleGroup) => ({
          id_muscle_group: muscleGroup.id_muscle_group,
          muscle: `${muscleGroup.muscle}`,
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

        this.athletes = res.data
          .filter((user) => user.role === "athletes")
          .map((user) => ({
            id_user: user.id_user,
            name: `${user.fName} ${user.lName}`,
          }));
      } catch (err) {
        console.error("Error fetching athletes:", err);
        this.athletes = [];
      }
    },

    deleteLesson(id_lesson) {
      if (!confirm("Are you sure you want to delete this lesson?")) return;

      lessonServices
        .deleteLesson(id_lesson)
        .then(() => {
          this.fetchLessons();
        })
        .catch((err) => {
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
        assignedUsers: [],
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
      if (
        !this.newLesson.title ||
        !this.newLesson.id_muscle_group ||
        !this.newLesson.assignedUsers.length
      ) {
        alert(
          "Title, Muscle Group, and at least one athlete assignment are required!"
        );
        return;
      }

      const lessonData = {
        title: this.newLesson.title,
        description: this.newLesson.description,
        id_muscle_group: this.newLesson.id_muscle_group,
        id_user: this.user?.id_user || null,
        assignedUsers: this.newLesson.assignedUsers,
      };

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
      await this.fetchLessons(); // refresh list
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
        await Promise.all([this.fetchMuscleGroups(), this.fetchAthletes()]);
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
    <CoachNav />

    <h1 class="text-h5 font-weight-bold mb-6"></h1>
    <h1 class="text-h5 font-weight-bold mb-6"></h1>

    <v-container class="mt-10">
      <div class="d-flex justify-space-between align-center mb-6">
        <h2> Exercise Plans </h2>

        <v-btn color="primary" @click="openModal" :disabled="loading">
          <v-icon left>mdi-plus-box</v-icon>
          Add Lesson
        </v-btn>
      </div>

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
            <v-icon size="48" color="primary"
              >mdi-book-open-page-variant</v-icon
            >
            <h3 class="mt-3">{{ lesson.title }}</h3>
            <p class="text-medium-emphasis">{{ lesson.description }}</p>

            <div class="mt-2">
              <!-- Assigned Athlete -->
              <div class="d-flex flex-wrap justify-center">
                <v-chip
                  v-for="user in lesson.assignedUsers"
                  :key="user.id_user"
                  color="blue"
                  small
                  class="ma-1"
                >
                  {{ user.fName }} {{ user.lName }}
                </v-chip>
                <v-chip
                  v-if="!lesson.assignedUsers?.length"
                  small
                  class="ma-1"
                  color="grey"
                  variant="tonal"
                >
                  No athletes assigned
                </v-chip>
              </div>

              <!-- Muscle group -->
              <v-chip
                v-if="lesson.muscleGroup"
                color="green"
                small
                class="mr-1"
              >
                {{
                  muscleGroups.find(
                    (m) => m.id_muscle_group === lesson.muscleGroup
                  )?.muscle
                }}
              </v-chip>
            </div>
            <v-chip v-if="lesson.difficulty" color="secondary" label>
              {{ lesson.difficulty }}
            </v-chip>

            <v-btn
              color="primary"
              class="mt-4"
              @click="goToLesson(lesson.id_lesson)"
            >
              View Lesson
            </v-btn>

            <v-btn
              color="secondary"
              class="mt-4 ml-2"
              @click="openAssignDialog(lesson)"
            >
              <v-icon left>mdi-account-multiple-plus</v-icon>
              Assign
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
        <v-card-title class="headline"
          >Create and Assign New Lesson</v-card-title
        >
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="newLesson.title"
              label="Lesson Title"
              required
            ></v-text-field>

            <v-select
              v-model="newLesson.assignedUsers"
              :items="athletes"
              item-title="name"
              item-value="id_user"
              label="Assign Lesson To Athletes"
              multiple
              chips
              required
            />

            <v-select
              v-model="newLesson.id_muscle_group"
              :items="muscleGroups"
              item-title="muscle"
              item-value="id_muscle_group"
              label="Target Muscle Group"
              :rules="[(v) => !!v || 'Muscle Group is required']"
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
        <v-card-title class="headline"> Delete Lesson </v-card-title>

        <v-card-text>
          Are you sure you want to delete
          <strong>{{ lessonToDelete?.title }}</strong
          >?
          <br />
          This action cannot be undone.
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="tonal" color="grey" @click="deleteDialog = false">
            Cancel
          </v-btn>

          <v-btn variant="flat" color=#ff0000 @click="deleteLesson">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="assignDialog" max-width="500">
      <v-card class="pa-4">
        <v-card-title class="headline">Assign Lesson</v-card-title>
        <v-card-text>
          <p class="mb-3">
            Assign <strong>{{ assignLesson?.title }}</strong> to athletes.
          </p>
          <v-select
            v-model="assignSelection"
            :items="athletes"
            item-title="name"
            item-value="id_user"
            label="Select athletes"
            multiple
            chips
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="assignDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveAssignments">Save</v-btn>
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
