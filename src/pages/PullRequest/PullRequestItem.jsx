import React, { useCallback, useEffect, useState } from 'react';
import { Steps, Button, Descriptions, Checkbox, message } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { BITBUCKET_ROOT, JIRA_ROOT } from '@/common/common';
import {
  getPullRequest,
  getRuleClassifications,
  getRuleList,
  postPullRequestReviews,
} from './request';
import './PullRequestItem.less';

const { Step } = Steps;

const steps = [
  {
    title: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];

export default function PullRequestItem(props) {
  const [current, setCurrent] = React.useState(0);
  const [pullRequestInfo, setPullRequestInfo] = useState({});
  const [ruleClassificationList, setRuleClassificationList] = useState([]);
  const [ruleList, setRuleList] = useState([]);

  // const formateStepList = (ruleClassificationList) => {
  //   const Temp = [];
  //   // eslint-disable-next-line no-return-assign
  //   ruleClassificationList.forEach((item) =>
  //     Temp[item.order] ? Temp[item.order].push(item) : (Temp[item.order] = [item]),
  //   );
  //   return Temp.filter((d) => d);
  // };

  useEffect(() => {
    getPullRequest(props.match.params.id).then((res) => {
      if (res.errCode === 0) {
        setPullRequestInfo(res.data);
      }
    });
    Promise.all([getRuleClassifications(), getRuleList()]).then(
      ([ruleClassificationRes, ruleListRes]) => {
        if (ruleListRes.errCode === 0 && ruleClassificationRes.errCode === 0) {
          setRuleClassificationList(ruleClassificationRes.data.sort((a, b) => a.order - b.order));
          setRuleList(ruleListRes.data);
        }
      },
    );
  }, []);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleCheckDown = useCallback(() => {
    console.log('success');
    postPullRequestReviews(props.match.params.id, {
      checkResults: ruleList.map((item) => ({
        ruleId: item.id,
        passed: item.passed ? item.passed : false,
      })),
    })
      .then((res) => {
        if (res.errCode === 0) {
          message.success('Review succeed!');
        } else {
          message.error('Review failed!');
        }
      })
      .catch(() => message.error('Review failed!'));
  }, [ruleList]);

  const handleCheckBoxChange = (item, value) => {
    console.log(item, value);
    ruleList.find((ruleItem) => ruleItem.id === item.id).passed = value;
    setRuleList([...ruleList]);
  };

  return (
    <>
      <div className="description-container">
        <Descriptions bordered>
          <Descriptions.Item label="name">{pullRequestInfo.name}</Descriptions.Item>
          <Descriptions.Item label="description">{pullRequestInfo.description}</Descriptions.Item>
          <Descriptions.Item label="bitbacket">
            <Button
              onClick={() =>
                window.open(
                  `${BITBUCKET_ROOT}/${pullRequestInfo.bitbucketPullRequestId}`,
                  '__blank',
                )
              }
              type="link"
              icon={<LinkOutlined />}
            >
              {pullRequestInfo.bitbucketPullRequestId}
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="jira">
            <Button
              onClick={() => window.open(`${JIRA_ROOT}/${pullRequestInfo.jiraId}`, '__blank')}
              type="link"
              icon={<LinkOutlined />}
            >
              {pullRequestInfo.jiraId}
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="owner">{pullRequestInfo.ownerName}</Descriptions.Item>
        </Descriptions>
      </div>
      {ruleClassificationList.length > 0 && (
        <div className="step-container">
          <Steps current={current}>
            {ruleClassificationList.map((item) => (
              <Step key={item.id} title={item.name} description={item.description} />
            ))}
          </Steps>
          <div className="steps-content">
            {ruleClassificationList[current] &&
              ruleList
                .filter(
                  (ruleItem) => ruleItem.classificationId === ruleClassificationList[current].id,
                )
                .map((ruleItem) => (
                  <Checkbox
                    key={ruleItem.id}
                    checked={ruleItem.passed ? ruleItem.passed : false}
                    onChange={(e) => handleCheckBoxChange(ruleItem, e.target.checked)}
                  >
                    <span className="check-name">{ruleItem.name}</span><span className="check-description">{ruleItem.description}</span>
                  </Checkbox>
                ))}
          </div>
          <div className="steps-action">
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={handleCheckDown}>
                Done
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                Previous
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
