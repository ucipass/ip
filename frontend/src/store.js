import { reactive } from 'vue'

export const store = reactive({
  config: null,
  language: "en",
  output: "Listening for Telnet, SSH, HTTP and ICMP packets..."
})