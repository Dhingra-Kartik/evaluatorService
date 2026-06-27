import express from "express";
import serverConfig from "./config/serverConfig.js";
import APIRouter from "./routes/index.js";
// import sampleQueueProducer from "./producers/sampleQueueProducer.js";
import SampleWorker from "./workers/sampleQueueWorker.js";
import bodyParser from "body-parser";
import runPython from "./containers/runPythonDocker.js";

const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', APIRouter);


app.listen(serverConfig.PORT, () => {
  console.log("WOW, Server started at port 4000");

  SampleWorker('SampleQueue');

  const code = `print("hello")
y = input()
print("value of y is:", y)`;
runPython(code, "100");

  // sampleQueueProducer('SampleJob', {
  //   name: "Sankiii",
  //   company: "MicroLaunch",
  //   position: "SDE ||||",
  //   location: "delhi ncr"
  // });
});
