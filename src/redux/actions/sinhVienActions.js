import {
  THEM_SINH_VIEN,
  XOA_SINH_VIEN,
  CHINH_SUA_SINH_VIEN,
  CAP_NHAT_SINH_VIEN,
  HUY_CHINH_SUA
} from '../types/sinhVienTypes';

/**
 * Action thêm mới sinh viên
 * @param {Object} sinhVien - Thông tin sinh viên mới
 */
export const themSinhVienAction = (sinhVien) => ({
  type: THEM_SINH_VIEN,
  payload: sinhVien
});

/**
 * Action xoá sinh viên theo mã SV
 * @param {string} maSV - Mã sinh viên cần xoá
 */
export const xoaSinhVienAction = (maSV) => ({
  type: XOA_SINH_VIEN,
  payload: maSV
});

/**
 * Action chọn sinh viên để đưa lên form chỉnh sửa
 * @param {Object} sinhVien - Thông tin sinh viên được chọn
 */
export const chinhSuaSinhVienAction = (sinhVien) => ({
  type: CHINH_SUA_SINH_VIEN,
  payload: sinhVien
});

/**
 * Action cập nhật thông tin sinh viên sau khi sửa
 * @param {Object} sinhVien - Thông tin sinh viên sau cập nhật
 */
export const capNhatSinhVienAction = (sinhVien) => ({
  type: CAP_NHAT_SINH_VIEN,
  payload: sinhVien
});

/**
 * Action huỷ trạng thái chỉnh sửa, reset về form thêm mới
 */
export const huyChinhSuaAction = () => ({
  type: HUY_CHINH_SUA
});
