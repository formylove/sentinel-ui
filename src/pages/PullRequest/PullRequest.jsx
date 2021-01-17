import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Table, Button, Tooltip, Tag, message, Menu, Descriptions } from 'antd';
import { history } from 'umi';
import { LinkOutlined } from '@ant-design/icons';
import { BITBUCKET_ROOT, JIRA_ROOT } from '@/common/common';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import moment from 'moment';
import {
  getPullRequestList as getPullRequestListFetch,
  getUserList,
  createPullRequest,
  updatePullRequest,
  getPullRequestReviewsList as getPullRequestReviewsListFetch,
  deleteReviews,
  deletePullRequest,
} from './request';
import './PullRequest.less';

const pageSize = 100;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const stateEnum = {
  APPENDING: <Tag color="warning">APPENDING</Tag>,
  MERGED: <Tag color="processing">MERGED</Tag>,
  READY: <Tag color="success">READY</Tag>,
};

export default function PullRequest() {
  const [pullRequestList, setPullRequestList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [userList, setUserList] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedKey, setSelectedKey] = useState([]);
  const [currentPRItem, setCurrentPRItem] = useState({});
  const [reviewList, setReviewList] = useState([]);

  const getPullRequestReviewsList = (id) => {
    getPullRequestReviewsListFetch(id).then((res) => {
      if (res.errCode === 0) {
        setReviewList(res.data);
      }
    });
  };

  const getPullRequestList = (page) => {
    getPullRequestListFetch({
      size: pageSize,
      page,
    }).then((res) => {
      if (res.errCode === 0) {
        setPullRequestList(res.data);
        getPullRequestReviewsList(res.data[0].id);
        setSelectedKey([res.data[0].id.toString()]);
        setCurrentPRItem(res.data[0]);
        setCurrentPage(res.pageNum);
        setTotalElements(res.totalElements);
      }
    });
  };

  useEffect(() => {
    getPullRequestList(currentPage);
    getUserList().then((res) => {
      if (res.errCode === 0) {
        setUserList(res.data);
      }
    });
  }, []);

  const columns = [
    {
      title: 'Reviewer Name',
      dataIndex: 'reviewerName',
      key: 'reviewerName',
      align: 'center',
    },
    {
      title: 'Creation Date',
      dataIndex: 'creationDate',
      key: 'creationDate',
      align: 'center',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Last Update Date',
      dataIndex: 'lastUpdateDate',
      key: 'lastUpdateDate',
      align: 'center',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'passed',
      dataIndex: 'passed',
      key: 'passed',
      align: 'center',
      render: (text) =>
        text ? <Tag color="success">success</Tag> : <Tag color="error">error</Tag>,
    },
    {
      title: 'Fail Rules',
      dataIndex: 'failRules',
      key: 'failRules',
      align: 'center',
      render: (text) => (
        <div>
          {text.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      ),
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      render: (text, record) => (
        <Button
          onClick={() => {
            deleteReviews(currentPRItem.id)
              .then((res) => {
                if (res.errCode === 0) {
                  message.success('Delete succeed!');
                  getPullRequestReviewsList(record.id);
                } else {
                  message.error('Delete failed!');
                }
              })
              .catch(() => {
                message.error('Delete failed!');
              });
          }}
          danger
        >
          delete
        </Button>
      ),
    },
  ];

  const handleMenuSelect = useCallback(
    (value) => {
      setSelectedKey([value.key]);
      setCurrentPRItem(pullRequestList.find((item) => item.id == value.key));
      getPullRequestReviewsList(value.key);
    },
    [pullRequestList],
  );

  return (
    <div className="pull-request-container">
      <div className="menuContainer">
        <Menu className="menu" onSelect={handleMenuSelect} selectedKeys={selectedKey}>
          {pullRequestList.length > 0 &&
            pullRequestList.map((item) => <Menu.Item key={item.id}>{item.name}</Menu.Item>)}
        </Menu>
        <ModalForm
          modalProps={{
            okText: 'Ok',
            cancelText: 'Cancel',
          }}
          title="Create Pull Request"
          layout="horizontal"
          trigger={<Button style={{ width: '100%' }}>Create Pull Request</Button>}
          onFinish={async (values) => {
            createPullRequest(values)
              .then((res) => {
                if (res.errCode === 0) {
                  message.success('Create succeed!');
                  getPullRequestList(0);
                } else {
                  message.error('Create failed!');
                }
              })
              .catch(() => {
                message.error('Create failed!');
              });
            return true;
          }}
        >
          <ProFormSelect
            mode="multiple"
            options={userList.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            name="assignees"
            label="assignees"
            labelAlign="left"
            placeholder=""
            {...layout}
            colon={false}
          />
          <ProFormText
            initialValue=""
            name="bitbucketPullRequestId"
            label="bitbucket pull request id"
            labelAlign="left"
            placeholder=""
            {...layout}
            colon={false}
          />
          <ProFormText
            initialValue=""
            name="description"
            label="description"
            labelAlign="left"
            placeholder=""
            {...layout}
            colon={false}
          />
          <ProFormText
            initialValue=""
            name="jiraId"
            label="jira id"
            labelAlign="left"
            placeholder=""
            {...layout}
            colon={false}
          />
          <ProFormText
            initialValue=""
            name="name"
            label="name"
            labelAlign="left"
            placeholder=""
            {...layout}
            colon={false}
          />
        </ModalForm>
      </div>
      <div className="right-container">
        <div className="control-container">
          {Object.keys(currentPRItem).length > 0 && (
            <Descriptions bordered>
              <Descriptions.Item label="name">{currentPRItem.name}</Descriptions.Item>
              <Descriptions.Item label="description">{currentPRItem.description}</Descriptions.Item>
              <Descriptions.Item label="owner">{currentPRItem.ownerName}</Descriptions.Item>
              <Descriptions.Item label="bitbacket">
                <Button
                  onClick={() =>
                    window.open(
                      `${BITBUCKET_ROOT}/${currentPRItem.bitbucketPullRequestId}`,
                      '__blank',
                    )
                  }
                  type="link"
                  icon={<LinkOutlined />}
                >
                  {currentPRItem.bitbucketPullRequestId}
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="jira">
                <Button
                  onClick={() => window.open(`${JIRA_ROOT}/${currentPRItem.jiraId}`, '__blank')}
                  type="link"
                  icon={<LinkOutlined />}
                >
                  {currentPRItem.jiraId}
                </Button>
              </Descriptions.Item>
              <Descriptions.Item label="status">
                {stateEnum[currentPRItem.prStatus]}
              </Descriptions.Item>

              <Descriptions.Item label="operation">
                <ModalForm
                  modalProps={{
                    okText: 'Ok',
                    cancelText: 'Cancel',
                  }}
                  title="Edit Pull Request"
                  layout="horizontal"
                  trigger={<Button style={{ marginRight: '10px' }}>Edit</Button>}
                  onFinish={async (values) => {
                    updatePullRequest(currentPRItem.id, values)
                      .then((res) => {
                        if (res.errCode === 0) {
                          message.success('Edit succeed!');
                          getPullRequestList(0);
                        } else {
                          message.error('Edit failed!');
                        }
                      })
                      .catch(() => {
                        message.error('Edit failed!');
                      });
                    return true;
                  }}
                >
                  <ProFormSelect
                    mode="multiple"
                    options={userList.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    initialValue={currentPRItem.assignees}
                    name="assignees"
                    label="assignees"
                    labelAlign="left"
                    placeholder=""
                    {...layout}
                    colon={false}
                  />
                  <ProFormText
                    initialValue={currentPRItem.bitbucketPullRequestId}
                    name="bitbucketPullRequestId"
                    label="bitbucket pull request id"
                    labelAlign="left"
                    placeholder=""
                    {...layout}
                    colon={false}
                  />
                  <ProFormText
                    initialValue={currentPRItem.description}
                    name="description"
                    label="description"
                    labelAlign="left"
                    placeholder=""
                    {...layout}
                    colon={false}
                  />
                  <ProFormText
                    initialValue={currentPRItem.jiraId}
                    name="jiraId"
                    label="jira id"
                    labelAlign="left"
                    placeholder=""
                    {...layout}
                    colon={false}
                  />
                  <ProFormText
                    initialValue={currentPRItem.name}
                    name="name"
                    label="name"
                    labelAlign="left"
                    placeholder=""
                    {...layout}
                    colon={false}
                  />
                </ModalForm>
                <Button
                  style={{ marginRight: '5px' }}
                  type="primary"
                  onClick={() => history.push(`/pull-requests/${currentPRItem.id}`)}
                >
                  To Check
                </Button>
                <Button
                  onClick={() => {
                    deletePullRequest(currentPRItem.id)
                      .then((res) => {
                        if (res.errCode === 0) {
                          message.success('Delete succeed!');
                          getPullRequestList(0);
                        } else {
                          message.error('Delete failed!');
                        }
                      })
                      .catch(() => {
                        message.error('Delete failed!');
                      });
                  }}
                  danger
                >
                  delete
                </Button>
              </Descriptions.Item>
            </Descriptions>
          )}
        </div>
        <Table columns={columns} rowKey="id" dataSource={reviewList} pagination={false} />
      </div>
    </div>
  );
}
