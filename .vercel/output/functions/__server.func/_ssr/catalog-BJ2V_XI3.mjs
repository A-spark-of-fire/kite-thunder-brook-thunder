import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { _ as mapSettings, h as mapProduct, m as mapPayment } from "./map-CpHYkenY.mjs";
import { r as getSql } from "./db-DCjHyC-w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-BJ2V_XI3.js
var listProducts_createServerFn_handler = createServerRpc({
	id: "2f3cb902609e50ac96044f7e96228fa2f59f70d4c357ba5479010af2a225aea2",
	name: "listProducts",
	filename: "src/lib/server/catalog.ts"
}, (opts) => listProducts.__executeServer(opts));
var listProducts = createServerFn({ method: "GET" }).handler(listProducts_createServerFn_handler, async () => {
	return (await (await getSql())`select * from products where is_active = true order by sort_order, id`).map(mapProduct);
});
var listPaymentMethods_createServerFn_handler = createServerRpc({
	id: "09cfdbca90d4db091d412f337439eb515ac2d763c3ff8aa0f26c068a918c5353",
	name: "listPaymentMethods",
	filename: "src/lib/server/catalog.ts"
}, (opts) => listPaymentMethods.__executeServer(opts));
var listPaymentMethods = createServerFn({ method: "GET" }).handler(listPaymentMethods_createServerFn_handler, async () => {
	return (await (await getSql())`select * from payment_methods where enabled = true order by sort_order`).map(mapPayment);
});
var getPublicSettings_createServerFn_handler = createServerRpc({
	id: "3e015ee0154b56b9cd44db361c2e0978e439d608cdf1c8d2722a5c5a7fd45965",
	name: "getPublicSettings",
	filename: "src/lib/server/catalog.ts"
}, (opts) => getPublicSettings.__executeServer(opts));
var getPublicSettings = createServerFn({ method: "GET" }).handler(getPublicSettings_createServerFn_handler, async () => {
	const rows = await (await getSql())`select * from agency_settings where id = 1`;
	return mapSettings(rows[0]);
});
//#endregion
export { getPublicSettings_createServerFn_handler, listPaymentMethods_createServerFn_handler, listProducts_createServerFn_handler };
