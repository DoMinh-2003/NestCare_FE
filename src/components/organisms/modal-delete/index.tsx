import { Modal } from 'antd';

export interface ModalDeleteProps {
    name: string;
    isModalOpenDelete: boolean;
    handleOkModalDelete: () => Promise<void>;
    handleCancelModalDelete: () => void;
}

const ModalDelete = ({ name, isModalOpenDelete, handleOkModalDelete, handleCancelModalDelete }: ModalDeleteProps) => {
    return (
        <Modal
            title={`Xóa ${name}`}
            open={isModalOpenDelete}
            onOk={handleOkModalDelete} // Call the delete handler on OK
            onCancel={handleCancelModalDelete}
        >
            <p>Bạn có chắc chắn muốn xóa {name}?</p>
        </Modal>
    );
}

export default ModalDelete;