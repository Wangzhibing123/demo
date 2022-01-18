import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Table, Tag, Button, Modal, Input, Space } from 'antd';
import './index.less';

interface TableItem {
  baseURL: string;
  contact: {
    FN: string;
    email: string;
  }[];
  description: string;
  humanURL: string;
  image: string;
  name: string;
  properties: Properties[];
  tags: string[];
}
interface Properties {
  type: string;
  url: string;
}
export default function IndexPage() {
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      width: 300,
    },
    {
      title: '图片',
      dataIndex: 'image',
      width: 120,
      render: (url: string) => {
        return <img className="img-content" src={url}/>
      }
    },
    {
      title: 'url',
      dataIndex: 'humanURL',
      width: 80,
      render: (url: string) => {
        return <Button type="link" size='small' href={url} target="_blank">链接</Button>
      }
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'name',
      render: (tags: string[]) => {
        return tags.map(tag => {
          return <Tag className="tag-content">{tag}</Tag>
        })
      }
    },
    {
      title: '操作',
      dataIndex: 'properties',
      key: 'properties',
      width: 150,
      render: (properties: Properties[]) => {
        return <Button onClick={() => handleShowModal(properties)}>查看信息</Button>
      }
    }
  ];
  const propertiesListColumns = [
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '地址',
      dataIndex: 'url'
    }
  ]
  const handleShowModal = (list: Properties[]) => {
    setPropertiesList(list);
    setIsModalVisible(true);
  }
  const handleGetList = () => {
    axios.get('http://www.mocky.io/v2/5ea28891310000358f1ef182').then(response => {
      const {apis} = response.data;
      setDataSource(apis);
      setBackupDataSource(apis);
    })
  }
  const handleDebounce = (event: string) => {
    return debounce(() => {
      handleFilterList(event)
    })
  };
  const handleFilterList = (name: string) => {
    if (name) {
      setDataSource(() => {
        return backupDataSource.filter(({tags}) => {
          return tags.some(value => value.indexOf(name) > -1);
        })
      })
    } else {
      setDataSource(backupDataSource)
    }
  }
  const [dataSource, setDataSource] = useState<TableItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [propertiesList, setPropertiesList] = useState<Properties[]>([]);
  const [backupDataSource, setBackupDataSource] = useState<TableItem[]>([]);
  useEffect(() => {
    handleGetList();
  }, [])
  return (
    <div className="container">
      <Space align="center">
        <span>tag搜索：</span>
        <Input className="input-container" onChange={({target: {value}}) => {
          handleDebounce(value)();
        }}/>
      </Space>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Modal
        visible={isModalVisible}
        title='信息查看'
        width={800}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Table
          dataSource={propertiesList}
          columns={propertiesListColumns}
          pagination={false}
        />
      </Modal>
    </div>
  );
}
// 防抖
function debounce(fn: Function, delay: number = 300) {
  let timer: any = null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() =>{
      fn();
    }, delay);
  }
}
// 优化
const table = tableList(3);
function tableList(length: number) {
   return new Array(length).fill(0).map((item, index) => {
     const num = index + 1;
     return {
       title: `标题${num}`,
       key: num.toString(),
       render: () => <a href={'http://hello.com/' + (num)}>item[{num}]</a>
     }
   });
}
