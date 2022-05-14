<template>
  <v-container class="py-0">
    <v-app-bar app flat dense fixed  color="background">
      <v-icon class="mr-2" v-on:click="goBack()">mdi-arrow-left</v-icon>
      <v-icon class="mr-2">mdi-medical-bag</v-icon>
      <v-toolbar-title>Build a Kit</v-toolbar-title>
    </v-app-bar>
        <v-card
      class="mx-auto"
      max-width="344"
      outlined
    >
      <v-list-item>
         <v-list-item-avatar
               tile
            size="80"
        >
          <v-img contain :src="baseKit.iconUrl" alt="" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1" v-text="baseKit.name">
            
          </v-list-item-title>
        </v-list-item-content>

      </v-list-item>

    </v-card>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field 
                label="Kit name" 
                v-model="name" 
                required  
                dense
                outlined
                :placeholder="`My ${baseKit.name}`"
                :rules="kitNameRules" 
                :counter="120"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
              <v-text-field outlined dense type="number" label="Adults" v-model="numberOfAdults" />
          </v-col>
          
          <v-col cols="4">
              <v-text-field outlined dense type="number" label="Children" v-model="numberOfChildren" />
          </v-col>
          
          <v-col cols="4">
              <v-text-field outlined dense type="number" label="Pets" v-model="numberOfPets" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
             <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        @click="createFromBaseKit"
                      >
                        Apply
                      </v-btn>
          </v-col>
        </v-row>
              </v-container>
    </v-form>

       <v-list>
         <v-list-item 
          v-for="item in kitItems"
          :key="item.id">
            <v-row>
              <v-col cols="auto">
                <v-list-item-action class="mr-0">
                  <v-checkbox
                    v-model="item.isAvailableInKit"
                    color="primary"
                  ></v-checkbox>
                </v-list-item-action>
              </v-col>
              <v-col cols="4">
                <v-list-item-action class="mr-0">
                <v-text-field type="number" 
                              outlined
                              dense
                              v-model="item.quantity"
                ></v-text-field>
                
              </v-list-item-action>
              </v-col>
              <v-col cols="auto">
                <v-list-item-content>
                <v-list-item-title>
                  <v-text-field type="text" 
                              outlined
                              dense
                              v-model="item.name"
                ></v-text-field>
                </v-list-item-title>
                </v-list-item-content>
              </v-col>
            </v-row>
                

              

  
         </v-list-item>

       </v-list>
        <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="addNewItem"
                >
                  Add New Item
                </v-btn>

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
              @click="isInEditMode ? saveKit() : createKit()"
            >
              {{ isInEditMode ? 'Save' : 'Create'}}
            </v-btn>
          </v-col>
        </v-row>
  <br/>
  <br/>
  <br/>
  <br/>

  </v-container>
</template>

<script>
import { maxLength, required } from '@/rules';
import { mapState } from "vuex";
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "EmergencyKitDetails",
  data: () => ({
    valid: false,
    id: null,
    isInEditMode: false,
    loading: false,
    baseKitId: "",
    numberOfAdults: 2,
    numberOfChildren: 1,
    numberOfPets: 1,
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
    items: "",
    kitItems: [],
    kitNameRules: [required(), maxLength(120)],
    kitItemNameRules: [required(), maxLength(120)]
  }),
  computed: mapState({
    isSaving: (state) => state.emergencyKitStore.isSaving,
    saveErrorMessage: (state) => state.emergencyKitStore.saveErrorMessage,
    baseKit(state){
      return state.baseKitStore.list.find((kit) => kit.id === this.baseKitId);
    } 
  }),
  async created() {
    this.baseKitId = this.$route.params.baseKitId;
    const loadingPromises = [];
    loadingPromises.push(this.$store.dispatch(`baseKitStore/getBaseKitListAsync`));
    if (this.$route.params.id)
    {
      this.isInEditMode = true;
      const kitPromise = this.$store.dispatch(
        `emergencyKitStore/getEmergencyKitAsync`,
        this.$route.params.id
      );
      loadingPromises.push(kitPromise);
      kitPromise.then(() => {
        const kit = this.$store.state.emergencyKitStore.item;
        this.name = kit.name;
        this.id = kit.id;

        this.kitItems = kit.kitItems.map(item => {
          return {
                id: item.id,
                baseKitItemId: item.baseKitItemId,
                name: item.name,
                isAvailableInKit: item.isAvailableInKit,
                description: item.description,
                quantity: item.quantity,
                quantityUnit: item.quantityUnit,
          }
        });
      });
    }
    await Promise.all(loadingPromises);
    this.loading = false;
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    removeKitItem(index) {
      this.kitItems.splice(index, 1);
    },
    addNewItem() {
      this.kitItems.push({
        id: uuidv4(),
        baseKitItemId: null,
        name: "New Item",
        isAvailableInKit: false,
        description: null,
        quantity: 0,
        quantityUnit: null
      });
    },
   createFromBaseKit() {
     if (this.baseKit && 
         this.baseKit.items && 
         this.baseKit.items.length > 0) {
          
          
          let newKitItems = this.baseKit.items.map(item => {
            return {
              id: uuidv4(),
              baseKitItemId: item.id,
              name: item.name,
              isAvailableInKit: false,
              description: item.description,
              quantity: (item.quantityPerAdult * this.numberOfAdults) 
                      + (item.quantityPerChild * this.numberOfChildren) 
                      + (item.quantityPerPet * this.numberOfPets),
              quantityUnit: item.quantityUnit,
            }
          });
          newKitItems = newKitItems.filter(i => i.quantity > 0);

          this.kitItems = this.kitItems.map(exitingItem => {
            const newKitItem = newKitItems.find(newItem => newItem.baseKitItemId === exitingItem.baseKitItemId);
            if (newKitItem)
            {
              return {
                id: exitingItem.id,
                baseKitItemId: exitingItem.baseKitItemId,
                name: exitingItem.name,
                isAvailableInKit: exitingItem.isAvailableInKit && (newKitItem.quantity === exitingItem.quantity),
                description: exitingItem.description,
                quantity: newKitItem.quantity,
                quantityUnit: exitingItem.quantityUnit,
              }
            }
            else {
              return exitingItem;
            }
          });

          this.kitItems.push(...newKitItems.filter(newItem => this.kitItems.findIndex(exitingItem => exitingItem.baseKitItemId === newItem.baseKitItemId) === -1));
       
     }
   },
    async createKit() {
      const success = await this.$store.dispatch(
        `emergencyKitStore/createEmergencyKitAsync`,
        {
          id: uuidv4(),
          name: this.name,
          baseKitId: this.baseKitId,
          kitItems: this.kitItems,
        }
      );
      if (success) {
        this.goBack();
      }
    },
    async saveKit() {
      const success = await this.$store.dispatch(
        `emergencyKitStore/saveEmergencyKitAsync`,
        {
          id: this.id,
          name: this.name,
          baseKitId: this.baseKitId,
          kitItems: this.kitItems,
        }
      );
      if (success) {
        this.goBack();
      }
    },
  },
};
</script>