import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  xoaSinhVienAction,
  chinhSuaSinhVienAction
} from '../redux/actions/sinhVienActions';

export const TableSinhVien = ({ danhSachHienThi }) => {
  const dispatch = useDispatch();
  const { selectedStudent } = useSelector((state) => state.sinhVienReducer);

  // Xử lý xoá sinh viên có hộp thoại xác nhận
  const handleDelete = (sv) => {
    const isConfirm = window.confirm(
      `Bạn có chắc chắn muốn xoá sinh viên "${sv.hoTen}" (Mã: ${sv.maSV}) không?`
    );
    if (isConfirm) {
      dispatch(xoaSinhVienAction(sv.maSV));
    }
  };

  // Xử lý chọn sinh viên để sửa
  const handleEdit = (sv) => {
    dispatch(chinhSuaSinhVienAction(sv));
    // Tự động cuộn lên đầu form trên thiết bị di động
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th className="py-3 px-3 text-center" style={{ width: '80px' }}>
                Mã SV
              </th>
              <th className="py-3 px-3">Họ tên</th>
              <th className="py-3 px-3">Số điện thoại</th>
              <th className="py-3 px-3">Email</th>
              <th className="py-3 px-3 text-center" style={{ width: '180px' }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {danhSachHienThi && danhSachHienThi.length > 0 ? (
              danhSachHienThi.map((sv) => {
                const isSelected = selectedStudent?.maSV === sv.maSV;
                return (
                  <tr
                    key={sv.maSV}
                    className={isSelected ? 'table-warning' : ''}
                  >
                    <td className="px-3 text-center fw-bold text-secondary">
                      {sv.maSV}
                    </td>
                    <td className="px-3 fw-semibold text-dark">
                      {sv.hoTen}
                      {isSelected && (
                        <span className="badge bg-warning text-dark ms-2">
                          Đang chọn
                        </span>
                      )}
                    </td>
                    <td className="px-3 text-secondary">{sv.soDienThoai}</td>
                    <td className="px-3 text-secondary">{sv.email}</td>
                    <td className="px-3 text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          title="Chỉnh sửa thông tin"
                          onClick={() => handleEdit(sv)}
                        >
                          <i className="fa-solid fa-pen-to-square me-1"></i>
                          Sửa
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          title="Xoá sinh viên"
                          onClick={() => handleDelete(sv)}
                        >
                          <i className="fa-solid fa-trash-can me-1"></i>
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-muted">
                  <i className="fa-regular fa-folder-open fa-2x mb-3 d-block text-secondary"></i>
                  <span>Không tìm thấy sinh viên nào phù hợp!</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="card-footer bg-light text-muted py-2 px-3 small d-flex justify-content-between">
        <span>Tổng số sinh viên: <strong>{danhSachHienThi.length}</strong></span>
        <span>CyberSoft Bootcamp ReactJS Form</span>
      </div>
    </div>
  );
};
