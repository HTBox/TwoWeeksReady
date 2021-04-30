import Address from "./Address";

export default class FamilyPlan {
  id = "";
  userId = "";
  title = "";
  phoneNumber = "";
  address = new Address();
  emergencyContacts = [];
  routes = [];
}