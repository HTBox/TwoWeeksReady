<template>
  <v-container class="py-0">
    <v-overlay :value="isLoading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-app-bar app flat dense fixed  color="background">
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-icon class="mr-2">mdi-medical-bag</v-icon>
      <v-toolbar-title>Emergency Kit Edit</v-toolbar-title>
    </v-app-bar>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field label="Kit name" v-model="name" required :rules="kitNameRules" :counter="120" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="9" lg="3">
            Color: <v-color-picker hide-inputs v-model="color" flat ></v-color-picker>
          </v-col>
          <v-col cols="3">
            <v-select label="Icon" v-model="icon" :items="icons" required :rules="iconRules">
              <template v-slot:item="{ item }">
                <v-divider class="mb-2"></v-divider>
                <v-list-item disabled>
                  <v-list-item-avatar :color="color">
                    <v-icon color="white">
                      {{ item.value }}
                    </v-icon>
                  </v-list-item-avatar>
                </v-list-item>
              </template>
              <template v-slot:selection="{ item }">
                <v-list-item-avatar :color="color">
                  <v-icon color="white">
                    {{ item.value }}
                  </v-icon>
                </v-list-item-avatar>
              </template>
            </v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="kitItems"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Kit Items</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Add Kit Item
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.name"
                                label="Item Name"
                                :rules="kitItemNameRules"
                                :counter="120"                                
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.description"
                                label="Description"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.quantity"
                                type="number"
                                label="Quantity"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                          Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="save" :disabled="editedItem.name.length == 0">
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="headline"
                        >Are you sure you want to delete this
                        item?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editKitItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteKitItem(item)"> mdi-delete </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-alert v-if="saveErrorMessage" type="error">{{
              saveErrorMessage
            }}</v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              :disabled="!valid || isSaving"
              :loading="isSaving"
              class="mr-4"
              @click="updateKit"
            >
              save
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
import { maxLength, required } from '@/rules';
import { mapState } from "vuex";

export default {
  name: "EmergencyKitEdit",
  data: () => ({
    valid: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Name",
        align: "start",
        value: "name",
      },
      { text: "Description", value: "description" },
      { text: "Quantity", value: "quantity" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    name: "",
    color: "#0000FF",
    icon: "",
    items: "",
    kitItems: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      description: "",
      quantity: 0,
    },
    defaultItem: {
      name: "My Kit Item",
      description: "A description of my kit item",
      quantity: 1,
    },
    kitNameRules: [required(), maxLength(120)],
    iconRules: [required()],
    kitItemNameRules: [required(), maxLength(120)]
  }),
  computed: mapState({
    isSaving: (state) => state.emergencyKitStore.isSaving,
    saveErrorMessage: (state) => state.emergencyKitStore.saveErrorMessage,
    isLoading: (state) => state.emergencyKitStore.isLoading,
    kit: (state) => state.emergencyKitStore.item,
    icons: () => {
      const materialIcons = [
        "mdi-alarm-light",
        "mdi-allergy",
        "mdi-ambulance",
        "mdi-bacteria",
        "mdi-bandage",
        "mdi-biohazard",
        "mdi-bottle-tonic-skull",
        "mdi-beehive-outline",
        "mdi-car-emergency",
        "mdi-campfire",
        "mdi-flash",
        "mdi-fire-extinguisher",
        "mdi-hospital-building",
        "mdi-skull-crossbones",
        "mdi-tank",
      ];

      return materialIcons.map((i) => {
        return {
          value: i,
          text: i,
        };
      });
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  }),
  watch: {
    kit(newKit) {
      // Our fancy notification (2).
      this.name = newKit.name;
      this.kitItems = newKit.kitItems.map(i => { return {...i}});
      this.icon = newKit.icon;
      this.color = newKit.color;
    },
  },
  mounted: function () {
    // Load the thing
    this.$store.dispatch(
      `emergencyKitStore/getEmergencyKitAsync`,
      this.$route.params.id
    );
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    removeKitItem(index) {
      this.kitItems.splice(index, 1);
    },

    async updateKit() {
      const success = await this.$store.dispatch(
        `emergencyKitStore/saveEmergencyKitAsync`,
        {
          id: this.$route.params.id,
          name: this.name,
          color: this.color,
          icon: this.icon,
          kitItems: this.kitItems,
        }
      );
      if (success) {
        this.goBack();
      }
    },

    editKitItem(item) {
      this.editedIndex = this.kitItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteKitItem(item) {
      this.editedIndex = this.kitItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.kitItems.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.kitItems[this.editedIndex], this.editedItem);
      } else {
        this.kitItems.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>