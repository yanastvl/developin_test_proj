<template>
  <v-row justify="center">
    <v-col
      cols="12"
      sm="6"
    >
      <v-card>
        <v-card-title class="blue darken-1">
          <span class="text-h5 white--text">{{ name }}</span>

          <v-spacer></v-spacer>

          <v-btn
            dark
            icon
            @click="goBack"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-card-title>

        <v-list>
          <v-list-item>
            <v-list-item-action>
              <span>Должность</span>
            </v-list-item-action>

            <v-list-item-content></v-list-item-content>

            <v-list-item-action>
              <span>{{ user.position }}</span>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-action>
              <span>Трудовая книжка сдана</span>
            </v-list-item-action>

            <v-list-item-content></v-list-item-content>

            <v-list-item-action>
              <span>{{ workBookSubmitted }}</span>
            </v-list-item-action>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-action>
              <span>Оклад</span>
            </v-list-item-action>

            <v-list-item-content></v-list-item-content>

            <v-list-item-action>
              <span>{{ user.salary }}</span>
            </v-list-item-action>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-action>
              <span>Дата выхода на работу</span>
            </v-list-item-action>

            <v-list-item-content></v-list-item-content>

            <v-list-item-action>
              <span>{{ startDate }}</span>
            </v-list-item-action>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-action>
              <span>Ставка</span>
            </v-list-item-action>

            <v-list-item-content></v-list-item-content>

            <v-list-item-action>
              <span>{{ user.rate }}</span>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment';

  export default {
      data() {
          return {
            user: JSON.parse(localStorage.getItem(this.id))
          }
      },
      props: {
          id: String,
      },
      computed: {
        name() {
          return `${this.user.surname} ${this.user.name} ${this.user.patronymic}`
        },
        startDate() {
          return this.user.startDate ? moment(this.user.startDate).format('DD.MM.YY') : ''
        },
        workBookSubmitted() {
          return {
            true: 'Да',
            false: 'Нет'
          }[this.user.workBookSubmitted]
        }
      },
      methods: {
        goBack() {
          this.$router.back()
        }
      }
    }
</script>
