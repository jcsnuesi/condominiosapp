"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Owner = require("../models/owners");
const Reserves = require("../models/reserves");
const controller = require("../controllers/reserves");
const ownerId = "689c04de8afc390549efd62d";
const condoId = "689c04de8afc390549efd62e";
const organizationId = "689c04de8afc390549efd62f";
for (const foreign of [false, true]) {
  test(foreign ? "OWNER cannot read another resident's booking history" : "OWNER history includes their bookings within their organization and active properties", async () => {
    const originalOwnerFind = Owner.find;
    const originalReservesFind = Reserves.find;
    let filter;
    Owner.find = () => ({ select() { return this; }, async exec() { return []; } });
    Reserves.find = value => {
      filter = value;
      return { populate() { return this; }, async exec() { return [{ memberId: ownerId }]; } };
    };
    const res = { statusCode: 0, status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; return this; } };
    try {
      await controller.getAllBookingByCondoAndUnit({
        params: { id: foreign ? organizationId : ownerId },
        user: { sub: ownerId, role: "OWNER" },
        auth: { role: "OWNER", organizationId, scope: { mode: "SELECTED", condominiumIds: [condoId] } },
      }, res);
      assert.equal(res.statusCode, foreign ? 403 : 200);
      if (foreign) assert.equal(filter, undefined);
      else {
        assert.equal(filter.organizationId, organizationId);
        assert.equal(filter.memberId, ownerId);
        assert.deepEqual(filter.condoId, { $in: [condoId] });
        assert.equal(filter.$or, undefined);
        assert.equal(res.body.message.length, 1);
      }
    } finally { Owner.find = originalOwnerFind; Reserves.find = originalReservesFind; }
  });
}
