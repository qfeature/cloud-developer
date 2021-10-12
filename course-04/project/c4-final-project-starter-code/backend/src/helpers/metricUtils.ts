import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement CloudWatch metric

import { createLogger } from '../utils/logger'
const logger = createLogger('metricUtils')

const cloudwatchNamespace = 'Udacity/ServerlessTodoApp'

export class MetricUtils {
    constructor(
        private readonly cloudwatch = new XAWS.CloudWatch(), // An instance of CloudWatch
        private readonly serviceName = 'serverlessTodoAppMetric') {
    }

    async setLatencyMetric(totalTime: number) {
        logger.info('Creating latency metric', totalTime)

        // Generating another data point
        await this.cloudwatch.putMetricData({
            MetricData: [
                {
                    MetricName: 'Latency',
                    Dimensions: [
                        {
                            Name: 'ServiceName',
                            Value: this.serviceName
                        }
                    ],
                    Unit: 'Milliseconds',
                    Value: totalTime
                }
            ],
            Namespace: cloudwatchNamespace
        }).promise()   
    }
}