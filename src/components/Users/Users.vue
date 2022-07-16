<template>
  <v-data-table
    :headers="headers"
    :items="employees"
    sort-by="name"
    class="elevation-1"
    :search="search"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Поиск"
          hide-details
        ></v-text-field>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="800px"
        >

          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Новый сотрудник
            </v-btn>
          </template>

          <v-card>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >

            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Имя"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.surname"
                      label="Фамилия"
                      :rules="surnameRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.patronymic"
                      label="Отчество"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.position"
                      label="Должность"
                      :rules="positionRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-checkbox
                      v-model="editedItem.workBookSubmitted"
                      label="Трудовая книжка сдана"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.salary"
                      label="Оклад"
                      :rules="numberRules"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-menu
                      v-model="menu1"
                      :close-on-content-click="false"
                      max-width="290"
                    >
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="computedDateFormattedMomentjs"
                      clearable
                      label="Дата выхода на работу"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="editedItem.startDate = null"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                      :header-date-format="headerDateFormat"
                      :title-date-format="titleDateFormat"
                      v-model="editedItem.startDate"
                     @change="menu1 = false"
                    ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                      >
                    <v-select
                      v-model="editedItem.rate"
                      :items="items"
                      label="Ставка"
                      required
                    ></v-select>
                  </v-col>

                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Отменить
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Сохранить
              </v-btn>
            </v-card-actions>

                </v-form>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h6">Вы уверены что хотите удалить сотрудника?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Отменить</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="showItem(item)"
      >
        mdi-account
      </v-icon>
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <span>Список сотрудников пуст</span>
    </template>
  </v-data-table>
</template>

<script>
import moment from 'moment';
import { format, parseISO } from 'date-fns';
moment.locale('ru');

  export default {
    components: {
    },
    data: () => ({

      search: '',
      dialog: false,
      dialogDelete: false,
      valid: true,
      headers: [
        { text: 'Имя', align: 'start', value: 'name' },
        { text: 'Фамилия', value: 'surname' },
        { text: 'Отчество', value: 'patronymic' },
        { text: 'Должность', value: 'position' },
        { text: 'Действия', value: 'actions', sortable: false },
      ],
      employees: [],
      editedIndex: -1,
      editedItem: {
        id : '',
        name: '',
        surname: '',
        patronymic: '',
        position: '',
        workBookSubmitted: false,
        salary: 0,
        startDate: '',
        rate: '',
      },
      defaultItem: {
        id: '',
        name: '',
        surname: '',
        patronymic: '',
        position: '',
        workBookSubmitted: false,
        salary: 0,
        startDate: '',
        rate: '',
      },
      nameRules: [
        v => !!v || 'Укажите имя',
        v => (v && v.length <= 20) || 'Имя не должно превышать 20 символов',
      ],
      surnameRules: [
        v => !!v || 'Укажите фамилию',
        v => (v && v.length <= 30) || 'Фамилия не должна превышать 30 символов',
      ],
      numberRules: [
        v => Number.isInteger(Number(v)) || 'Допустимо только числовое значение',
        v => v > 0 || 'Оклад должен быть больше 0'
      ],
      positionRules: [
        v => !!v || 'Укажите должность',
        v => !Number.isInteger(Number(v)) || 'Должность не может состоять только из цифр'
      ],
      date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      menu1: false,
      items: [
        'Полная',
        'Половина',
      ],
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Создание сотрудника' : 'Редактирование сотрудника'
      },
      computedDateFormattedMomentjs () {
        return this.editedItem.startDate ? moment(this.editedItem.startDate).format('DD.MM.YY') : ''
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      employeeUniqueKey () {
        return Array(8).fill(null).map(() => Math.random().toString(18).substr(2)).join('');
      },

      initialize () {
        const employees = []
        Object.keys(localStorage).forEach(function(key){
          employees.push(JSON.parse(localStorage.getItem(key)));
        })
        this.employees = employees;
      },

      headerDateFormat() {
        const date = this.editedItem.startDate ? this.editedItem.startDate : this.date
        return moment(date).format('DD MMMM YYYY')
      },

      titleDateFormat() {
        const date = this.editedItem.startDate ? this.editedItem.startDate : this.date
        return moment(date).format('dddd DD MMMM YYYY')
      },

      editItem (item) {
        this.editedIndex = this.employees.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.employees.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      showItem (item) {
        this.$router.push({name: 'user', params: {id: item.id}});
      },

      deleteItemConfirm () {
        this.employees.splice(this.editedIndex, 1)
        localStorage.removeItem(this.editedItem.id);
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.$refs.form.validate()) {
          if (this.editedIndex > -1) {
            Object.assign(this.employees[this.editedIndex], this.editedItem)
          } else {
            this.employees.push(this.editedItem);
            this.editedItem['id'] = this.employeeUniqueKey();
          }
            localStorage.setItem(this.editedItem.id, JSON.stringify(this.editedItem));
            this.close()
          }
        },
      },
  }
</script>

<style scoped>

</style>