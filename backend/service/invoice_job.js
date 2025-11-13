const {
  format,
  startOfMonth,
  endOfMonth,
  addDays,
  isValid,
  parseISO,
} = require("date-fns");
const cron = require("node-cron");
const Invoice = require("../models/invoice");
const Condominium = require("../models/condominio");
const Owner = require("../models/owners");

/**
 * Generate unique invoice number without external Counter model
 * @param {String} condominiumId - Condominium ID
 * @returns {String} - Unique invoice number
 */
async function generateinvoice_number(condominiumId) {
  try {
    const currentMonth = format(new Date(), "yyyyMM");

    // Get count of invoices for this condominium in current month
    const count = await Invoice.countDocuments({
      condominiumId: condominiumId,
      issueDate: {
        $gte: startOfMonth(new Date()),
        $lte: endOfMonth(new Date()),
      },
    });

    // Generate invoice number with condominium prefix
    const condoPrefix = condominiumId.toString().slice(-6).toUpperCase();
    const invoice_number = `INV-${condoPrefix}-${currentMonth}-${(count + 1)
      .toString()
      .padStart(4, "0")}`;

    // Check if this invoice number already exists (extra safety)
    const existing = await Invoice.findOne({ invoice_number });
    if (existing) {
      // If exists, append timestamp to make it unique
      return `${invoice_number}-${Date.now().toString().slice(-4)}`;
    }

    return invoice_number;
  } catch (error) {
    console.error("Error generating invoice number:", error);
    // Fallback to timestamp-based number
    return `INV-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;
  }
}

/**
 * Generate monthly invoice for a specific owner in a condominium
 * @param {Object} condominiumData - Condominium information
 * @param {String} ownerId - Owner ID
 * @param {Date} issueDate - Invoice issue date
 * @param {Date} dueDate - Invoice due date
 */
async function generateOwnerInvoice(
  condominiumData,
  ownerId,
  issueDate,
  dueDate
) {
  try {
    // Check if invoice already exists for this owner and month
    const existingInvoice = await Invoice.findOne({
      condominiumId: condominiumData._id,
      ownerId: ownerId,
      issueDate: {
        $gte: startOfMonth(issueDate),
        $lte: endOfMonth(issueDate),
      },
    });

    if (existingInvoice) {
      console.log(
        `📄 Invoice already exists for owner ${ownerId} in ${condominiumData.alias} - ${existingInvoice.invoice_number}`
      );
      return existingInvoice;
    }

    // Generate unique invoice number
    const invoice_number = await generateinvoice_number(condominiumData._id);

    // Create new invoice
    const newInvoice = new Invoice({
      issueDate: issueDate,
      dueDate: dueDate,
      amount: condominiumData.mPayment || 0,
      description: `Monthly maintenance fee - ${format(
        issueDate,
        "MMMM yyyy"
      )}`,
      status: "pending",
      condominiumId: condominiumData._id,
      ownerId: ownerId,
      createdBy: condominiumData.createdBy,
      invoice_number: invoice_number,
    });

    const savedInvoice = await newInvoice.save();
    console.log(
      `✅ Invoice created for owner ${ownerId} in ${condominiumData.alias}: ${savedInvoice.invoice_number}`
    );

    return savedInvoice;
  } catch (error) {
    console.error(
      `❌ Error creating invoice for owner ${ownerId} in ${condominiumData.alias}:`,
      error.message
    );
    throw error; // Re-throw to handle in parent function
  }
}

/**
 * Generate monthly invoice for a specific unit owned by an owner
 * @param {Object} condominiumData - Condominium information
 * @param {String} ownerId - Owner ID
 * @param {String} unitNumber - Unit number/identifier
 * @param {Date} issueDate - Invoice issue date
 * @param {Date} dueDate - Invoice due date
 */
async function generateUnitInvoice(
  condominiumData,
  ownerId,
  unitNumber,
  issueDate,
  dueDate
) {
  try {
    // Check if invoice already exists for this SPECIFIC UNIT and month
    const existingInvoice = await Invoice.findOne({
      condominiumId: condominiumData._id,
      ownerId: ownerId,
      unitNumber: unitNumber, // KEY ADDITION: Check by unit
      issueDate: {
        $gte: startOfMonth(issueDate),
        $lte: endOfMonth(issueDate),
      },
    });

    if (existingInvoice) {
      console.log(
        `📄 Invoice already exists for owner ${ownerId}, unit ${unitNumber} in ${condominiumData.alias} - ${existingInvoice.invoice_number}`
      );
      return existingInvoice;
    }

    // Generate unique invoice number
    const invoice_number = await generateinvoice_number(condominiumData._id);

    // Create new invoice for this specific unit
    const newInvoice = new Invoice({
      issueDate: issueDate,
      dueDate: dueDate,
      amount: condominiumData.mPayment || 0,
      description: `Monthly maintenance fee - Unit ${unitNumber} - ${format(
        issueDate,
        "MMMM yyyy"
      )}`,
      status: "pending",
      condominiumId: condominiumData._id,
      ownerId: ownerId,
      unitNumber: unitNumber, // KEY ADDITION: Include unit number
      createdBy: condominiumData.createdBy,
      invoice_number: invoice_number,
    });

    const savedInvoice = await newInvoice.save();
    console.log(
      `✅ Invoice created for owner ${ownerId}, unit ${unitNumber} in ${condominiumData.alias}: ${savedInvoice.invoice_number}`
    );

    return savedInvoice;
  } catch (error) {
    console.error(
      `❌ Error creating invoice for owner ${ownerId}, unit ${unitNumber} in ${condominiumData.alias}:`,
      error.message
    );
    throw error;
  }
}

/**
 * Get all units owned by a specific owner in a condominium
 * @param {String} condominiumId - Condominium ID
 * @param {String} ownerId - Owner ID
 * @returns {Array} - Array of unit numbers owned by the owner
 */
async function getOwnerUnits(condominiumId, ownerId) {
  try {
    // Get the condominium with populated owner details
    const condominium = await Condominium.findById(condominiumId)
      .populate({
        path: "units_ownerId",
        match: { _id: ownerId, status: "active" },
        select: "_id availableUnits propertyDetails",
      })
      .lean();

    const units = condominium.units_ownerId
      .map((owner) => owner.propertyDetails)
      .flat()
      .map((c) => c.condominium_unit);

    if (
      !condominium ||
      !condominium.units_ownerId ||
      condominium.units_ownerId.length === 0
    ) {
      console.log(
        `⚠️  No units found for owner ${ownerId} in condominium ${condominiumId}`
      );
      return [];
    }

    // Extract available units for this owner
    const owner = condominium.units_ownerId[0];
    // console.log("🔍 owner:", owner);
    return units || [];
  } catch (error) {
    console.error(
      `❌ Error getting units for owner ${ownerId}:`,
      error.message
    );
    return [];
  }
}

/**
 * Generate monthly invoices for a specific owner (all their units)
 * @param {Object} condominiumData - Condominium information
 * @param {String} ownerId - Owner ID
 * @param {Date} issueDate - Invoice issue date
 * @param {Date} dueDate - Invoice due date
 */
async function generateOwnerInvoices(
  condominiumData,
  ownerId,
  issueDate,
  dueDate
) {
  try {
    // Get all units owned by this owner in this condominium
    const ownerUnits = await getOwnerUnits(condominiumData._id, ownerId);

    if (!ownerUnits || ownerUnits.length === 0) {
      console.log(
        `⚠️  No units found for owner ${ownerId} in ${condominiumData.alias}`
      );
      return {
        ownerId,
        unitsProcessed: 0,
        successful: 0,
        failed: 0,
        invoices: [],
      };
    }

    console.log(
      `👤 Processing owner ${ownerId} with ${ownerUnits.length} units in ${condominiumData.alias}`
    );

    let successful = 0;
    let failed = 0;
    const invoices = [];
    const errors = [];
    console.log("⚠️  ownerUnits", ownerUnits);
    // Generate invoice for each unit owned by this owner
    for (const unitNumber of ownerUnits) {
      try {
        const invoice = await generateUnitInvoice(
          condominiumData,
          ownerId,
          unitNumber,
          issueDate,
          dueDate
        );

        if (invoice) {
          invoices.push(invoice);
          successful++;
        }
      } catch (error) {
        failed++;
        errors.push({ unitNumber, error: error.message });
        console.error(
          `❌ Failed to create invoice for unit ${unitNumber}:`,
          error.message
        );
      }
    }

    console.log(
      `👤 Owner ${ownerId}: ${successful}/${ownerUnits.length} unit invoices created`
    );

    return {
      ownerId,
      unitsProcessed: ownerUnits.length,
      successful,
      failed,
      invoices,
      errors: failed > 0 ? errors : undefined,
    };
  } catch (error) {
    console.error(`❌ Error processing owner ${ownerId}:`, error.message);
    return {
      ownerId,
      unitsProcessed: 0,
      successful: 0,
      failed: 1,
      invoices: [],
      error: error.message,
    };
  }
}

/**
 * Generate monthly invoices for all owners in a condominium (UPDATED)
 * @param {Object} condominium - Condominium data
 */
async function generateCondominiumInvoices(condominium) {
  try {
    if (!condominium.units_ownerId || condominium.units_ownerId.length === 0) {
      console.log(`⚠️  No owners found for condominium ${condominium.alias}`);
      return {
        condominium: condominium.alias,
        totalOwners: 0,
        totalUnits: 0,
        successful: 0,
        failed: 0,
      };
    }

    // Validate payment amount
    if (!condominium.mPayment || condominium.mPayment <= 0) {
      console.log(
        `⚠️  Invalid payment amount for condominium ${condominium.alias}`
      );
      return {
        condominium: condominium.alias,
        totalOwners: 0,
        totalUnits: 0,
        successful: 0,
        failed: 0,
        error: "Invalid payment amount",
      };
    }

    // Calculate dates
    const currentDate = new Date();
    const paymentDay = condominium.paymentDate || 1;
    const issueDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      Math.min(paymentDay, 28)
    );
    const dueDate = addDays(issueDate, 30); // 30 days to pay

    console.log(`🏢 Processing condominium: ${condominium.alias}`);
    console.log(`💰 Monthly payment per unit: $${condominium.mPayment}`);
    console.log(`📅 Issue Date: ${format(issueDate, "dd/MM/yyyy")}`);
    console.log(`⏰ Due Date: ${format(dueDate, "dd/MM/yyyy")}`);
    console.log(`👥 Owners to process: ${condominium.units_ownerId.length}`);

    let totalUnitsProcessed = 0;
    let totalInvoicesCreated = 0;
    let totalFailed = 0;
    const ownerResults = [];

    // Process each owner (and all their units)
    for (const ownerId of condominium.units_ownerId) {
      try {
        const ownerResult = await generateOwnerInvoices(
          condominium,
          ownerId,
          issueDate,
          dueDate
        );

        ownerResults.push(ownerResult);
        totalUnitsProcessed += ownerResult.unitsProcessed;
        totalInvoicesCreated += ownerResult.successful;
        totalFailed += ownerResult.failed;
      } catch (error) {
        totalFailed++;
        console.error(`❌ Failed to process owner ${ownerId}:`, error.message);
      }
    }

    console.log(`📊 Condominium ${condominium.alias} Summary:`);
    console.log(`   👥 Owners processed: ${condominium.units_ownerId.length}`);
    console.log(`   🏠 Total units: ${totalUnitsProcessed}`);
    console.log(`   ✅ Invoices created: ${totalInvoicesCreated}`);
    console.log(`   ❌ Failed: ${totalFailed}`);

    return {
      condominium: condominium.alias,
      totalOwners: condominium.units_ownerId.length,
      totalUnits: totalUnitsProcessed,
      successful: totalInvoicesCreated,
      failed: totalFailed,
      ownerResults,
      errors:
        totalFailed > 0
          ? ownerResults.filter((r) => r.error || r.errors)
          : undefined,
    };
  } catch (error) {
    console.error(
      `❌ Error processing condominium ${condominium.alias}:`,
      error.message
    );
    return {
      condominium: condominium.alias,
      totalOwners: 0,
      totalUnits: 0,
      successful: 0,
      failed: 1,
      error: error.message,
    };
  }
}

/**
 * Generate monthly invoices for all active condominiums
 */
async function generateAllMonthlyInvoices() {
  try {
    console.log(
      `🚀 Starting monthly invoice generation - ${format(
        new Date(),
        "dd/MM/yyyy HH:mm:ss"
      )}`
    );

    // Get all active condominiums with their owners
    const condominiums = await Condominium.find({
      status: "active",
      units_ownerId: { $exists: true, $ne: [] },
      mPayment: { $exists: true, $gt: 0 }, // Only condos with valid payment amounts
    })
      .select("alias units_ownerId mPayment paymentDate createdBy status")
      .lean();

    if (!condominiums || condominiums.length === 0) {
      console.log(
        "⚠️  No active condominiums found with valid payment configuration"
      );
      return;
    }

    console.log(`🏘️  Found ${condominiums.length} active condominiums`);

    // Process condominiums sequentially to avoid database overload
    const results = [];
    for (const condominium of condominiums) {
      const result = await generateCondominiumInvoices(condominium);
      results.push(result);

      // Small delay to prevent overwhelming the database
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Generate summary report
    let totalInvoices = 0;
    let totalSuccessful = 0;
    let totalFailed = 0;

    console.log("\n📋 INVOICE GENERATION SUMMARY");
    console.log("================================");

    results.forEach((result) => {
      const { condominium, totalUnits, successful, failed, error } = result;
      totalInvoices += totalUnits;
      totalSuccessful += successful;
      totalFailed += failed;

      if (error) {
        console.log(`❌ ${condominium}: ${error}`);
      } else {
        console.log(
          `✅ ${condominium}: ${successful}/${totalUnits} invoices created`
        );
      }
    });

    console.log("================================");
    console.log(
      `📊 TOTAL: ${totalSuccessful} successful, ${totalFailed} failed out of ${totalInvoices} total`
    );
    console.log(
      `✅ Invoice generation completed - ${format(
        new Date(),
        "dd/MM/yyyy HH:mm:ss"
      )}\n`
    );

    return {
      totalInvoices,
      totalSuccessful,
      totalFailed,
      results,
    };
  } catch (error) {
    console.error(
      "❌ Critical error in monthly invoice generation:",
      error.message
    );
    throw error;
  }
}

/**
 * Setup cron jobs for automatic invoice generation
 */
async function setupInvoiceCronJobs() {
  try {
    console.log("⚙️ Setting up invoice cron jobs...");

    // Monthly invoice generation - 1st day of each month at 8:00 AM   "*/10 * * * * *",
    cron.schedule(
      "0 8 1 * *",
      async () => {
        console.log("🔄 Monthly invoice cron job triggered");
        try {
          await generateAllMonthlyInvoices();
        } catch (error) {
          console.error("❌ Monthly cron job failed:", error.message);
        }
      },
      {
        scheduled: true,
        timezone: "America/Santo_Domingo",
      }
    );

    // Daily check for missed invoices - every day at 9:00 AM
    cron.schedule(
      "0 9 * * *",
      async () => {
        console.log("🔍 Daily invoice check triggered");
        try {
          await checkMissedInvoices();
        } catch (error) {
          console.error("❌ Daily check failed:", error.message);
        }
      },
      {
        scheduled: true,
        timezone: "America/Santo_Domingo",
      }
    );

    console.log("✅ Invoice cron jobs configured successfully");
    console.log("📅 Monthly generation: 1st day of month at 8:00 AM");
    console.log("🔍 Daily check: Every day at 9:00 AM");
  } catch (error) {
    console.error("❌ Error setting up cron jobs:", error.message);
  }
}

/**
 * Check for and generate any missed invoices
 */
async function checkMissedInvoices() {
  try {
    console.log("🔍 Checking for missed invoices...");

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get all active condominiums
    const condominiums = await Condominium.find({
      status: "active",
      units_ownerId: { $exists: true, $ne: [] },
      mPayment: { $exists: true, $gt: 0 },
    }).lean();

    let totalMissed = 0;

    for (const condominium of condominiums) {
      // Check if invoices were generated for current month
      const invoiceCount = await Invoice.countDocuments({
        condominiumId: condominium._id,
        issueDate: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1),
        },
      });

      const expectedCount = condominium.units_ownerId.length;

      if (invoiceCount < expectedCount) {
        console.log(
          `⚠️  Missing invoices detected for ${condominium.alias}: ${invoiceCount}/${expectedCount}`
        );
        await generateCondominiumInvoices(condominium);
        totalMissed += expectedCount - invoiceCount;
      }
    }

    console.log(
      `✅ Missed invoice check completed. Generated ${totalMissed} missing invoices`
    );
  } catch (error) {
    console.error("❌ Error checking missed invoices:", error.message);
  }
}

/**
 * Manual trigger for invoice generation (for testing)
 */
async function manualInvoiceGeneration() {
  console.log("🧪 Manual invoice generation triggered");
  try {
    const result = await generateAllMonthlyInvoices();
    console.log("🧪 Manual generation completed:", result);
    return result;
  } catch (error) {
    console.error("🧪 Manual generation failed:", error.message);
    throw error;
  }
}

/**
 * Get invoice statistics for monitoring
 */
async function getInvoiceStatistics() {
  try {
    const currentMonth = startOfMonth(new Date());

    const stats = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: currentMonth },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    return stats;
  } catch (error) {
    console.error("Error getting invoice statistics:", error.message);
    return [];
  }
}

/**
 * Testing cron job (runs every 30 seconds for debugging)
 */
function testingCron() {
  cron.schedule(
    "*/30 * * * * *",
    () => {
      console.log(
        "🧪 Test cron executed:",
        format(new Date(), "dd/MM/yyyy HH:mm:ss")
      );
    },
    {
      scheduled: true,
      timezone: "America/Santo_Domingo",
    }
  );

  console.log("🧪 Testing cron job started - runs every 30 seconds");
}

module.exports = {
  setupInvoiceCronJobs,
  generateAllMonthlyInvoices,
  manualInvoiceGeneration,
  checkMissedInvoices,
  getInvoiceStatistics,
  testingCron,
};
