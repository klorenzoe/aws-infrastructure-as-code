import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as eventBus from "aws-cdk-lib/aws-events";
import * as eventRule from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";

export class GreetingsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //#region Lambda Function
    const politeGreetingFunction = new lambda.Function(
      this,
      "PoliteGreetingFunction",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("./code/polite"),
        handler: "greeting.handler",
      }
    );

    const informalGreetingFunction = new lambda.Function(
      this,
      "InformalGreetingFunction",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("./code/informal"),
        handler: "greeting.handler",
      }
    );
    //#endregion

    //#region EventBridge (Bus and Rules)
    const bus = new eventBus.EventBus(this, "GreetingsEventBus", {
      eventBusName: "GreetingsEventBus",
    });

    const politeGreetingRule = new eventRule.Rule(this, "politeGreetingRule", {
      description: "return a polite greeting",
      eventPattern: {
        source: ["polite"],
      },
      eventBus: bus,
    });

    politeGreetingRule.addTarget(
      new targets.LambdaFunction(politeGreetingFunction)
    );

    const informalGreetingRule = new eventRule.Rule(
      this,
      "informalGreetingRule",
      {
        description: "return an informal greeting",
        eventPattern: {
          source: ["informal"],
        },
        eventBus: bus,
      }
    );

    informalGreetingRule.addTarget(
      new targets.LambdaFunction(informalGreetingFunction)
    );
    //#endregion
  }
}
