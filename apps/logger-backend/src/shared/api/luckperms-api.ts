import ky from "ky";

export const luckpermsAPI = ky.extend({
  prefixUrl: "http://localhost:4000",
  headers: {
    'Authorization': `Bearer ${process.env.SECRET_TOKEN}`,
  },
})