import { reactive } from 'vue'

export const store = reactive({
  config: null,
  language: "en",
  output: `${(new Date()).toLocaleTimeString()} - Listening for Telnet, SSH, HTTP and ICMP packets...`,
  pausedOutput: "",
  socketIO:
  {
    messages: {},
    io: null,
    pause: false,
    status: "No status info"
  },
  modalMessage: {
    title: "Title",
    Messagef: "Message",
  }
})