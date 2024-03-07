let obsWebSocket;
let FilterEnabled;
let sourceName = "mediachat";

loadObsWebSocket();

function loadObsWebSocket() {
  obsWebSocket = new WebSocket("ws://localhost:4455");

  obsWebSocket.addEventListener("open", () => {
    console.log("Connected to OBS WebSocket");
  });

  obsWebSocket.addEventListener("message", event => {
    const response = JSON.parse(event.data);
    console.log("Received response:", response["d"]);

    switch (response["d"]["requestId"]) {
      case "1": // GetSourceFilterList
        switch (response["d"]["requestStatus"]["code"]) {
          case 100:
            //Filter found
            console.log("Filter found");
            FilterEnabled = response["d"]["responseData"]["filterEnabled"];
            break;
          case 600:
            //Filter not found
            console.log("Filter not found");
            ObsCreateFilter();
            break;
          default:
            break;
        }
        break;
      case "2": // CreateSourceFilter
        console.log("Filter created");
        ObsEnableSourceFilter(false);
        break;
      case "3": // EnableSourceFilter
        console.log("Hello world !");
        break;
      default:
        //console.log(response)
        break;
    }
  });

  obsWebSocket.addEventListener("close", () => {
    console.log("Connection to OBS WebSocket closed");
  });

  setTimeout(() => {
    const getIdentity = {
      op: 1,
      d: {
        rpcVersion: 1,
        eventSubscriptions: 33,
      },
    };

    obsWebSocket.send(JSON.stringify(getIdentity));

    ObsGetSourceFilterList();
  }, 1000);
}

function ObsGetSourceFilterList() {
  const GetSourceFilterList = {
    op: 6,
    d: {
      requestType: "GetSourceFilter",
      requestId: "1",
      requestData: {
        sourceName: sourceName,
        filterName: "greenscreen",
      },
    },
  };

  obsWebSocket.send(JSON.stringify(GetSourceFilterList));
}

function ObsCreateFilter() {
  const createSourceFilter = {
    op: 6,
    d: {
      requestType: "CreateSourceFilter",
      requestId: "2",
      requestData: {
        sourceName: sourceName,
        filterName: "greenscreen",
        filterKind: "chroma_key_filter_v2",
        filterSettings: {
          key_color_type: "custom",
          key_color: 0x00ff00, //green
        },
      },
    },
  };

  obsWebSocket.send(JSON.stringify(createSourceFilter));
}

export function ObsEnableSourceFilter(param) {
  const enableSourceFilter = {
    op: 6,
    d: {
      requestType: "SetSourceFilterEnabled",
      requestId: "3",
      requestData: {
        sourceName: sourceName,
        filterName: "greenscreen",
        filterEnabled: param,
      },
    },
  };

  obsWebSocket.send(JSON.stringify(enableSourceFilter));
}

function ObsChangeFilterColor(hexColor) {
  //Code temporaire le temps que je trouve un fix

  switch (hexColor) {
    case "true":
    case "green":
      hexColor = 0x00ff00;
      break;
    case "blue":
      hexColor = 0xff9900;
      break;
    case "magenta":
      hexColor = 0xff00ff;
      break;
  }

  const changeSourceFilterSettings = {
    op: 6,
    d: {
      requestType: "SetSourceFilterSettings",
      requestId: "4",
      requestData: {
        sourceName: sourceName,
        filterName: "greenscreen",
        filterSettings: {
          key_color_type: "custom",
          key_color: hexColor,
        },
      },
    },
  };

  obsWebSocket.send(JSON.stringify(changeSourceFilterSettings));
}
