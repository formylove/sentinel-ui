import React from 'react';
import { Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import ClipboardJS from 'clipboard';

class Clipboard extends React.Component {
  constructor(props) {
    super(props);
    this.clipboard = null;

    this.copyRef = React.createRef();
  }

  componentWillUnmount() {
    // destroy clipboard
    if (this.clipboard) this.clipboard.destroy();
  }

  onClick = (e) => {
    const { onSuccess, onError, selection, options } = this.props;
    const target = this.copyRef.current;

    if (!this.clipboard) {
      this.clipboard = new ClipboardJS(target, options);
      this.clipboard.on('success', (event) => {
        if (!selection) event.clearSelection(); // 是否清除选中
        if (onSuccess) onSuccess(target);
      });
      this.clipboard.on('error', () => {
        if (onError) onError(target);
      });

      this.clipboard.onClick(e);
    }
  }

  render() {
    const { target, onSuccess, onError, text, action, selection, children, ...other } = this.props;

    if (children) {
      React.Children.only(children); // 用来约束子组件的个数

      return React.cloneElement(children, {
        ...other,
        'data-clipboard-action': action,
        'data-clipboard-text': text,
        'data-clipboard-target': target,
        onClick: this.onClick,
        ref: this.copyRef,
      });
    }
    return (
      <Button
        {...other}
        size="small"
        type="link"
        data-clipboard-action={action}
        data-clipboard-text={text}
        data-clipboard-target={target}
        onClick={this.onClick}
        ref={this.copyRef}
        icon={<CopyOutlined />} />
    );
  }
}

Clipboard.defaultProps = {
  action: 'copy',
  selection: true,
};

Clipboard.propTypes = {
  target: PropTypes.string, // 操作的目标
  action: PropTypes.oneOf(['copy']),
  text: PropTypes.string, //  操作的文本
  onSuccess: PropTypes.func, // 操作成功回调
  onError: PropTypes.func, // 操作失败回调
  selection: PropTypes.bool, // 是否选择 默认是选中的  如不需要选中 设置为false
  options: PropTypes.object, // options
};

export default Clipboard;
