const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

router.post('/subscribe/:planId', auth, async (req, res) => {
  const { planId } = req.params;
  const plan = await Plan.findById(planId);
  if (!plan) return res.status(404).json({ message: 'Plan not found' });
  const start_date = new Date();
  const end_date = new Date(start_date.getTime() + plan.duration * 24 * 60 * 60 * 1000);
  await Subscription.updateMany({ user: req.user.id, status: 'active' }, { status: 'expired' });
  const sub = await Subscription.create({ user: req.user.id, plan: plan._id, start_date, end_date, status: 'active' });
  res.json(sub);
});

router.get('/my-subscription', auth, async (req, res) => {
  const sub = await Subscription.findOne({ user: req.user.id, status: 'active' }).populate('plan');
  if (!sub) return res.json({ subscription: null });
  res.json({ subscription: sub });
});


router.get('/admin', auth, requireRole('admin'), async (req, res) => {
  const subs = await Subscription.find().populate('user', 'name email').populate('plan');
  res.json(subs);
});

module.exports = router;
