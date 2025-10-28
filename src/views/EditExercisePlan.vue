<script setup>
import ExercisePlanServicesServices from "../services/exercisePlanServices";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const valid = ref(false);
const exercisePlan = ref({});
const message = ref("Enter data and click save");

const props = defineProps({
  exerciseId: {
    required: true,
  },
  exercisePlanId: {
    required: true,
  },
});

const retrieveExercisePlan = () => {
  ExercisePlanServices.getExercisePlan(props.exerciseId, props.exercisePlanId)
    .then((response) => {
      exercisePlan.value = response.data;
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const saveExercisePlan = () => {
  var data = {
    title: exercisePlan.value.title,
    description: exercisePlan.value.description,
    exerciseId: exercisePlan.value.exerciseId,
  };
  ExercisePlanServices.updateExercisePlan(exercisePlan.value.exerciseId, exercisePlan.value.id, data)
    .then((response) => {
      exercisePlan.value.id = response.data.id;

      router.push({
        name: "view",
        params: { id: exercisePlan.value.exerciseId },
      });
    })
    .catch((e) => {
      message.value = e.response.data.message;
    });
};

const cancel = () => {
  router.push({
    name: "view",
    params: { id: exercisePlan.value.exerciseId },
  });
};

onMounted(() => {
  retrieveExercisePlan();
});
</script>

<template>
  <div>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>ExercisePlan Edit</v-toolbar-title>
      </v-toolbar>
      <br />
      <h4>{{ message }}</h4>
      <br />
      <h4>Exercise: {{ exerciseId }} ExercisePlan: {{ exercisePlanId }}</h4>
      <br />
      <v-form ref="form" v-model="valid" lazy validation>
        <v-text-field
          v-model="exercisePlan.title"
          id="title"
          :counter="50"
          label="Title"
          required
        ></v-text-field>
        <v-text-field
          v-model="exercisePlan.description"
          id="description"
          :counter="50"
          label="Description"
          required
        ></v-text-field>
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="saveExercisePlan"
        >
          Save
        </v-btn>

        <v-btn color="error" class="mr-4" @click="cancel"> Cancel </v-btn>
      </v-form>
    </v-container>
  </div>
</template>
