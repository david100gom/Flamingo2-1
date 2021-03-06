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
package org.openflamingo.mapreduce.etl.grep;

/**
 * Regular Expression Enumeration.
 *
 * @author Byoung Gon, Kim
 * @author Seo Ji Hye
 * @since 0.1
 */
public enum RegEx {

    EMAIL("^(?:\\w+\\.?)*\\w+@(?:\\w+\\.)+\\w+$"),
    JUMIN("[0-9]{6}-(1|2|3|4)[0-9]{6}"),
    HTML_LINK("(http|https|ftp)://[^\\s^\\.]+(\\.[^\\s^\\.]+)*"),
    HTML_TAG("<(?:.|\\s)*?>");

    /**
     * Regular Expression
     */
    private String regularExpression;

    /**
     * Regular Expression를 설정한다.
     *
     * @param regularExpression regularExpression
     */
    RegEx(String regularExpression) {
        this.regularExpression = regularExpression;
    }

    /**
     * Regular Expression를 반환한다.
     *
     * @return regularExpression
     */
    public String getRegularExpression() {
        return regularExpression;
    }
}
