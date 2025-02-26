const moment = require("moment");
const cron = require("node-cron");
const Invoice = require("../models/invoice");
const Condominium = require("../models/condominio");

// // Función para generar una factura
async function generarFacturaMensual(
  id,
  issueDate,
  dueDate,
  mPayment,
  description,
  createdBy,
  ownersId,
  alias
) {
  try {
    console.log(
      id,
      issueDate,
      dueDate,
      mPayment,
      description,
      createdBy,
      ownersId,
      alias
    );

    const ownersIds = ownersId.map((owner) => {
      return new Invoice({
        issueDate: issueDate,
        issueDate: dueDate,
        amount: mPayment,
        description: description,
        createdBy: createdBy,
        condominiumId: id,
        ownerId: owner,
      });
    });

    await Invoice.insertMany(ownersIds);

    console.log(`Factura creada para el condominio ${ownersIds}`);
  } catch (error) {
    console.error(`Error generando la factura: ${error}`);
  }
}

// Función que configura los cron jobs dinámicos
async function configurarCronJobs() {
  try {
    const condominios = await Condominium.find(); // Obtener todos los condominios

    condominios.forEach((condominio) => {
      if (condominio.alias == "Rogelia Nin de Sola") {
        const id = condominio._id;
        const mPayment_val = condominio.mPayment;
        const paymentDate_val = condominio.paymentDate;
        const createdBy_val = condominio.createdBy;

        let invoice_issue_day = moment(paymentDate_val).date(); // Obtener el día de pago del condominio
        // Configurar cron job dinámico basado en el día del mes
        const cronExpresion = "*/5 * * * * *";
        // `0 0 ${invoice_issue_day} * *`; // Ejemplo: '0 0 15 * *' para el día 15 de cada mes

        cron.schedule(
          cronExpresion,
          async () => {
            const fechaActual = new Date(paymentDate_val);
            const issueDate = fechaActual.toISOString();

            try {
              // Fecha de vencimiento: 30 días después de la fecha de emisión
              const dueDate = new Date(
                fechaActual.setDate(fechaActual.getDate() + 30)
              ).toISOString();

              // Aquí asumes un monto y descripción fijos, o podrías obtener estos datos de algún lugar

              const description = "Factura de mantenimiento"; // Descripción de ejemplo
              let ownersId = condominio.units_ownerId;
              // Generar la factura para el condominio en la fecha programada

              await generarFacturaMensual(
                id,
                issueDate,
                dueDate,
                mPayment_val,
                description,
                createdBy_val,
                ownersId,
                condominio.alias
              );
            } catch (error) {
              console.log(
                `Error generando factura para el condominio ${condominio.alias}: ${error}`
              );
            }
          },
          {
            scheduled: true,
            timezone: "America/Santo_Domingo", // Ajustar la zona horaria según sea necesario
          }
        );

        console.log(
          `Cron job configurado para el condominio ${condominio.alias} el día ${invoice_issue_day} de cada mes.`
        );
      }
    });
  } catch (error) {
    console.error(`Error configurando cron jobs: ${error}`);
  }
}

function testingCron() {
  cron.schedule("* * * * *", () => {
    console.log(
      "Tarea cron ejecutada cada 1 minuto:",
      new Date().toLocaleString()
    );
  });
}

module.exports = {
  configurarCronJobs,
  testingCron,
};
