import express from "express";
import serverConfig from "./config/serverConfig.js";
import APIRouter from "./routes/index.js";
// import sampleQueueProducer from "./producers/sampleQueueProducer.js";
//import SampleWorker from "./workers/sampleQueueWorker.js";
import bodyParser from "body-parser";
//import runPython from "./containers/runPythonDocker.js";
//import runJava from "./containers/runJavaDocker.js";
//import runCpp from "./containers/runCppDocker.js";
import SubmissionWorker from "./workers/submissionWorker.js";
import { SUBMISSION_QUEUE_NAME } from "./utils/constants.js";
import submissionQueueProducer from "./producers/submissionQueueProducer.js";

const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', APIRouter);


app.listen(serverConfig.PORT, () => {
  console.log("WOW, Server started at port 4000");

  //SampleWorker('SampleQueue');
  SubmissionWorker(SUBMISSION_QUEUE_NAME);
  const code = `#include<iostream>
  using namespace std;
  
  int main(){
  int x;
  cin>>x;
  cout<<"The value of x is: "<<x;
  
  cout<<endl;
  return 0;
  }`;
  const inputCase = `1001`;
  //runCpp(code, "1019");
  submissionQueueProducer({"1234":{
    language: "CPP",
    inputCase,
    code,
  }});


  //JAVA CODE RUNNING
//   const code = `import java.util.Scanner;
// public class Main {
//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);
//         String x = sc.nextLine();
//         System.out.println("You entered: " + x);
//         sc.close();
//     }
// }
// `;
// runJava(code, "1000");


//PYTHON CODE RUNNING
//   const code = `print("hello")
// y = input()
// print("value of y is:", y)`;
// runPython(code, "100");

  // sampleQueueProducer('SampleJob', {
  //   name: "Sankiii",
  //   company: "MicroLaunch",
  //   position: "SDE ||||",
  //   location: "delhi ncr"
  // });
});
