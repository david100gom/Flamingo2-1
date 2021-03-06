/**
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 * <p/>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * <p/>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p/>
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.opencloudengine.flamingo2.engine.history;

import org.opencloudengine.flamingo2.core.repository.PersistentRepository;
import org.opencloudengine.flamingo2.model.rest.WorkflowHistory;

import java.util.List;

public interface WorkflowHistoryRepository extends PersistentRepository<WorkflowHistory, Long> {

    public static final String NAMESPACE = WorkflowHistoryRepository.class.getName();

    void updateCurrentStep(WorkflowHistory workflowHistory);

    WorkflowHistory selectByJobId(String jobId);

    WorkflowHistory selectByIdentifier(String identifier);

    List<WorkflowHistory> selectByCondition(String startDate, String endDate, int start, int limit, String username, String workflowName, String status, String sf_parentIdentifier);

    void updateStatus(WorkflowHistory workflowHistory);

    int selectTotalCountByUsername(String startDate, String endDate, int start, int limit, String username, String workflowName, String status, String sf_parentIdentifier);
}
