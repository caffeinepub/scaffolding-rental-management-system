import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import List "mo:core/List";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile
  public type UserProfile = {
    name : Text;
    email : Text;
    role : AccessControl.UserRole;
  };

  module UserProfile {
    public func compare(p1 : UserProfile, p2 : UserProfile) : Order.Order {
      Text.compare(p1.email, p2.email);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("No user profile found") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User profile does not exist") };
      case (?p) { p };
    };
  };

  // Customers
  public type Customer = {
    name : Text;
    npwp : Text;
    address : Text;
    contactPerson : Text;
    phone : Text;
    email : Text;
    creditLimit : Nat;
  };

  let customers = Map.empty<Text, Customer>();

  public shared ({ caller }) func addCustomer(customer : Customer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add customers");
    };
    switch (customers.get(customer.npwp)) {
      case (null) {
        customers.add(customer.npwp, customer);
      };
      case (?_) { Runtime.trap("Customer with this NPWP already exists") };
    };
  };

  public shared ({ caller }) func updateCustomer(npwp : Text, customer : Customer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update customers");
    };
    
    // Check if credit limit is being changed - requires admin approval
    switch (customers.get(npwp)) {
      case (null) { Runtime.trap("Customer not found") };
      case (?existingCustomer) {
        if (existingCustomer.creditLimit != customer.creditLimit) {
          if (not (AccessControl.isAdmin(accessControlState, caller))) {
            Runtime.trap("Unauthorized: Only admins can change credit limits");
          };
        };
        customers.add(npwp, customer);
      };
    };
  };

  public shared ({ caller }) func deleteCustomer(npwp : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete customers");
    };
    switch (customers.get(npwp)) {
      case (null) { Runtime.trap("Customer not found") };
      case (?_) {
        customers.remove(npwp);
      };
    };
  };

  public query ({ caller }) func getCustomer(npwp : Text) : async Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view customers");
    };
    switch (customers.get(npwp)) {
      case (null) { Runtime.trap("Customer not found") };
      case (?customer) { customer };
    };
  };

  public query ({ caller }) func getCustomers() : async [Customer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view customers");
    };
    if (customers.isEmpty()) {
      return [];
    };
    let iter = customers.values();
    iter.toArray();
  };

  // Vendors
  public type Vendor = {
    companyName : Text;
    npwp : Text;
    address : Text;
    contactPerson : Text;
    phone : Text;
    email : Text;
    bankAccount : Text;
    paymentTerms : Nat;
  };

  let vendors = Map.empty<Text, Vendor>();

  public shared ({ caller }) func addVendor(vendor : Vendor) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add vendors");
    };
    switch (vendors.get(vendor.npwp)) {
      case (null) {
        vendors.add(vendor.npwp, vendor);
      };
      case (?_) { Runtime.trap("Vendor with this NPWP already exists") };
    };
  };

  public shared ({ caller }) func updateVendor(npwp : Text, vendor : Vendor) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update vendors");
    };
    switch (vendors.get(npwp)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?_) { vendors.add(npwp, vendor) };
    };
  };

  public shared ({ caller }) func deleteVendor(npwp : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete vendors");
    };
    switch (vendors.get(npwp)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?_) {
        vendors.remove(npwp);
      };
    };
  };

  public query ({ caller }) func getVendor(npwp : Text) : async Vendor {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view vendors");
    };
    switch (vendors.get(npwp)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?vendor) { vendor };
    };
  };

  public query ({ caller }) func getVendors() : async [Vendor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view vendors");
    };
    if (vendors.isEmpty()) {
      return [];
    };
    let iter = vendors.values();
    iter.toArray();
  };

  // Inventory Management
  public type ItemType = {
    #Frame;
    #Board;
    #Pipe;
    #Clamp;
    #Accessory;
  };

  public type ConditionStatus = {
    #New;
    #Good;
    #Fair;
    #Damaged;
  };

  public type InventoryItem = {
    itemId : Text;
    itemType : ItemType;
    quantity : Nat;
    condition : ConditionStatus;
    location : Text;
    acquisitionCost : Nat;
  };

  let inventory = Map.empty<Text, InventoryItem>();

  public shared ({ caller }) func addInventoryItem(item : InventoryItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add inventory items");
    };
    switch (inventory.get(item.itemId)) {
      case (null) {
        inventory.add(item.itemId, item);
      };
      case (?_) { Runtime.trap("Item with this ID already exists") };
    };
  };

  public shared ({ caller }) func updateInventoryItem(itemId : Text, item : InventoryItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update inventory items");
    };
    switch (inventory.get(itemId)) {
      case (null) { Runtime.trap("Item not found") };
      case (?_) { inventory.add(itemId, item) };
    };
  };

  public shared ({ caller }) func deleteInventoryItem(itemId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete inventory items");
    };
    switch (inventory.get(itemId)) {
      case (null) { Runtime.trap("Item not found") };
      case (?_) {
        inventory.remove(itemId);
      };
    };
  };

  public query ({ caller }) func getInventoryItem(itemId : Text) : async InventoryItem {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inventory items");
    };
    switch (inventory.get(itemId)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) { item };
    };
  };

  public query ({ caller }) func getInventoryItems() : async [InventoryItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inventory items");
    };
    if (inventory.isEmpty()) {
      return [];
    };
    let iter = inventory.values();
    iter.toArray();
  };

  // Rental Orders
  public type RentalOrderStatus = {
    #Booked;
    #QuotationApproved;
    #Delivered;
    #Active;
    #Returned;
  };

  public type RentalOrder = {
    orderId : Text;
    customerId : Text;
    itemIds : [Text]; // Array of referenced item IDs
    startDate : Text;
    endDate : Text;
    status : RentalOrderStatus;
  };

  let rentalOrders = Map.empty<Text, RentalOrder>();

  public shared ({ caller }) func createOrder(order : RentalOrder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create orders");
    };
    switch (rentalOrders.get(order.orderId)) {
      case (null) {
        rentalOrders.add(order.orderId, order);
      };
      case (?_) { Runtime.trap("Order with this ID already exists") };
    };
  };

  public shared ({ caller }) func updateOrder(orderId : Text, order : RentalOrder) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update orders");
    };
    switch (rentalOrders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?_) { rentalOrders.add(orderId, order) };
    };
  };

  public shared ({ caller }) func deleteOrder(orderId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete orders");
    };
    switch (rentalOrders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?_) {
        rentalOrders.remove(orderId);
      };
    };
  };

  public query ({ caller }) func getOrder(orderId : Text) : async RentalOrder {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    switch (rentalOrders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  public query ({ caller }) func getAllOrders() : async [RentalOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };
    if (rentalOrders.isEmpty()) {
      return [];
    };
    let iter = rentalOrders.values();
    iter.toArray();
  };
};
