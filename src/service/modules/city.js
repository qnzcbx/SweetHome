import { BXRequest } from "../request";

const cityRequest = new BXRequest("http://codercba.com:1888/api", 10000)
export function getCityAll() {
  return cityRequest.get({
    url: "/city/all"
  })
}