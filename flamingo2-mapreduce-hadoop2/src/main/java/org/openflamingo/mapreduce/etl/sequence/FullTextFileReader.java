/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openflamingo.mapreduce.etl.sequence;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.InputSplit;
import org.apache.hadoop.mapreduce.RecordReader;
import org.apache.hadoop.mapreduce.TaskAttemptContext;
import org.apache.hadoop.mapreduce.lib.input.LineRecordReader;
import org.openflamingo.mapreduce.util.HdfsUtils;

import java.io.IOException;

public class FullTextFileReader extends RecordReader<Text, Text> {

    private final LineRecordReader lineRecordReader;

    private Text key = new Text();

    private Text value = new Text();

    public FullTextFileReader() throws IOException {
        lineRecordReader = new LineRecordReader();
    }

    public void initialize(InputSplit inputSplit, TaskAttemptContext context) throws IOException {
        lineRecordReader.initialize(inputSplit, context);
        key.set(HdfsUtils.getFilename(inputSplit));
    }

    public synchronized boolean nextKeyValue() throws IOException {
        StringBuilder builder = new StringBuilder();
        while (lineRecordReader.nextKeyValue()) {
            Text text = lineRecordReader.getCurrentValue();
            builder.append(text.toString());
            System.out.println(text.toString());
        }
        value.set(builder.toString());
        return true;
    }

    public Text getCurrentKey() {
        return key;
    }

    public Text getCurrentValue() {
        return value;
    }

    public float getProgress() throws IOException {
        return lineRecordReader.getProgress();
    }

    public synchronized void close() throws IOException {
        lineRecordReader.close();
    }
}