require("dotenv").config();

const mongoose = require("mongoose");

const prompt = require("prompt-sync")();

const Customer = require("./models/customer");

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Welcome to the CRM ");
  await runQueries();
};

const runQueries = async () => {
  console.log(
    " \nWhat would you like to do? \n\n    1. Create a customer \n    2. View all customers \n    3. Update a customer \n    4. Delete a customer \n    5. quit\n"
  );
  const action = prompt("Number of action to run: ");
  if (action === "1") {
    createCustomer();
  } else if (action === "2") {
    viewCustomers();
  } else if (action === "3") {
    updateCustomer();
  } else if (action === "4") {
    deleteCustomer();
  } else if (action === "5") {
    console.log("\n");
    console.log("exiting...");
    mongoose.disconnect();
    process.exit();
  }
};

const createCustomer = async () => {
  console.log("\n");
  const name = await prompt("What is the customer's name? ");
  console.log("\n");
  const age = await prompt("What is the customer's age? ");
  console.log("\n");
  const customerData = { name, age };

  const customer = await Customer.create(customerData);
  runQueries();
};

const viewCustomers = async () => {
  console.log("\n");
  const customers = await Customer.find({});
  for (let customer of customers) {
    console.log(
      `id: ${customer._id} -- name: ${customer.name}, age: ${customer.age}\n`
    );
  }
  runQueries();
};

const updateCustomer = async () => {
  console.log("Below is a list of customers: \n");
  const customers = await Customer.find({});
  for (let customer of customers) {
    console.log(
      `id: ${customer._id} -- name: ${customer.name}, age: ${customer.age}\n`
    );
  }

  const id = prompt(
    "Copy and paste the id of the customer you would like to update here: "
  );
  console.log("\n");
  const name = prompt("What is the customers new name? ");
  console.log("\n");
  const age = prompt("What is the customers new age? ");
  console.log("\n");
  const updated = await Customer.findByIdAndUpdate(
    id,
    { name, age },
    { new: true }
  );
  runQueries();
};

const deleteCustomer = async () => {
  console.log("Below is a list of customers: \n");
  const customers = await Customer.find({});
  for (let customer of customers) {
    console.log(
      `id: ${customer._id} -- name: ${customer.name}, age: ${customer.age}\n`
    );
  }

  const id = prompt(
    "Copy and paste the id of the customer you would like to delete here: "
  );
  await Customer.findByIdAndDelete(id);
  runQueries();
};

connect();
