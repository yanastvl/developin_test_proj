<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-icon></v-icon>
        <div class="text-h4">Сотрудники компании</div>
      </div>
    </v-app-bar>
    <v-main>
      <v-container class="mt-10">
        <v-row>
          <v-col>
            <router-view/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import Users from '@/components/Users/Users.vue';

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
