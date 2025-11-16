const Plan = require("../models/Plan");

module.exports = async function seedPlans() {
  const exists = await Plan.find();
  if (exists.length) return console.log("Plans already seeded");

  const plans = [
    {
      name: "Free Trial",
      price: 0,
      features: ["Limited access", "Basic support"],
      duration: 7,
    },
    {
      name: "Starter",
      price: 0,
      features: ["1 project", "Community support"],
      duration: 30,
    },
    {
      name: "Pro",
      price: 9.99,
      features: ["10 projects", "Email support", "Analytics"],
      duration: 30,
    },
    {
      name: "Business",
      price: 29.99,
      features: ["Unlimited projects", "Priority support", "SLA"],
      duration: 30,
    },
    {
      name: "Enterprise",
      price: 99.99,
      features: [
        "Custom solutions",
        "Dedicated manager",
        "24/7 premium support",
      ],
      duration: 30,
    },
  ];

  await Plan.insertMany(plans);
  console.log("Plans seeded");
};
