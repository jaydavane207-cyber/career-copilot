// backend/models/Subscription.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Subscription Model
 * Manages user billing tiers, payment gateway transaction IDs (Razorpay/Stripe),
 * subscription lifecycle (active, canceled, expired), and billing renewals.
 */
const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  tier: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'premium', // 'premium' | 'pro'
    comment: 'Subscribed tier: premium or pro'
  },
  billingCycle: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'monthly', // 'monthly' | 'yearly'
    field: 'billing_cycle'
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Amount in minor units (e.g. ₹799.00 -> 79900 paise, $9.99 -> 999 cents)'
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'INR',
    comment: 'INR | USD'
  },
  gateway: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'mock_checkout', // 'razorpay' | 'stripe' | 'mock_checkout'
    comment: 'Payment gateway provider'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active', // 'active' | 'canceled' | 'expired' | 'past_due'
    comment: 'Subscription status'
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'order_id'
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'payment_id'
  },
  currentPeriodStart: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'current_period_start'
  },
  currentPeriodEnd: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'current_period_end'
  },
  cancelAtPeriodEnd: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'cancel_at_period_end'
  },
  metadata: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON serialized transaction / invoice details'
  }
}, {
  tableName: 'subscriptions',
  timestamps: true
});

// Property aliases for snake_case/camelCase interoperability
Object.defineProperty(Subscription.prototype, 'user_id', {
  get() { return this.getDataValue('userId'); },
  set(val) { this.setDataValue('userId', val); }
});

Object.defineProperty(Subscription.prototype, 'billing_cycle', {
  get() { return this.getDataValue('billingCycle'); },
  set(val) { this.setDataValue('billingCycle', val); }
});

Object.defineProperty(Subscription.prototype, 'order_id', {
  get() { return this.getDataValue('orderId'); },
  set(val) { this.setDataValue('orderId', val); }
});

Object.defineProperty(Subscription.prototype, 'payment_id', {
  get() { return this.getDataValue('paymentId'); },
  set(val) { this.setDataValue('paymentId', val); }
});

Object.defineProperty(Subscription.prototype, 'current_period_start', {
  get() { return this.getDataValue('currentPeriodStart'); },
  set(val) { this.setDataValue('currentPeriodStart', val); }
});

Object.defineProperty(Subscription.prototype, 'current_period_end', {
  get() { return this.getDataValue('currentPeriodEnd'); },
  set(val) { this.setDataValue('currentPeriodEnd', val); }
});

Object.defineProperty(Subscription.prototype, 'cancel_at_period_end', {
  get() { return this.getDataValue('cancelAtPeriodEnd'); },
  set(val) { this.setDataValue('cancelAtPeriodEnd', val); }
});

// Helper migration function to create subscriptions table in SQLite or PostgreSQL
Subscription.syncColumns = async () => {
  try {
    const dialect = sequelize.getDialect();
    if (dialect === 'sqlite') {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          tier VARCHAR(50) NOT NULL,
          billing_cycle VARCHAR(50) NOT NULL DEFAULT 'monthly',
          amount INTEGER NOT NULL,
          currency VARCHAR(10) NOT NULL DEFAULT 'INR',
          gateway VARCHAR(50) NOT NULL DEFAULT 'mock_checkout',
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          order_id VARCHAR(255),
          payment_id VARCHAR(255),
          current_period_start DATETIME NOT NULL,
          current_period_end DATETIME NOT NULL,
          cancel_at_period_end BOOLEAN DEFAULT 0,
          metadata TEXT,
          createdAt DATETIME,
          updatedAt DATETIME,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
      `);
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions (user_id, status);
      `);
    } else if (dialect === 'postgres') {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          tier VARCHAR(50) NOT NULL,
          billing_cycle VARCHAR(50) NOT NULL DEFAULT 'monthly',
          amount INTEGER NOT NULL,
          currency VARCHAR(10) NOT NULL DEFAULT 'INR',
          gateway VARCHAR(50) NOT NULL DEFAULT 'mock_checkout',
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          order_id VARCHAR(255),
          payment_id VARCHAR(255),
          current_period_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          current_period_end TIMESTAMP NOT NULL,
          cancel_at_period_end BOOLEAN DEFAULT FALSE,
          metadata TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions (user_id, status);
      `);
    }
  } catch (err) {
    console.warn('⚠️ [Subscription.syncColumns] Notice:', err.message);
  }
};

module.exports = Subscription;
