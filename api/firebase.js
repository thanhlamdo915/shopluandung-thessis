import admin from 'firebase-admin'
import serviceAccount from "./shopluandung-3dde3-firebase-adminsdk-ltmmx-d4a92651ca.json" with { type: "json" };;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "shopluandung-3dde3.appspot.com",
});
const bucket = admin.storage().bucket();

export default {
  bucket,
};
