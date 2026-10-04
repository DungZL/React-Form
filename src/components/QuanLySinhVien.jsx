import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FormSinhVien } from './FormSinhVien';
import { TableSinhVien } from './TableSinhVien';

/**
 * Hàm hỗ trợ loại bỏ dấu tiếng Việt để tìm kiếm linh hoạt
 * @param {string} str - Chuỗi ban đầu
 * @returns {string} - Chuỗi không dấu, chữ thường
 */
const removeVietnameseTones = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

export const QuanLySinhVien = () => {
  // Lấy toàn bộ danh sách sinh viên từ Redux store
  const { danhSachSinhVien } = useSelector((state) => state.sinhVienReducer);

  // State cục bộ lưu từ khoá tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Lọc danh sách sinh viên theo họ tên (dùng hàm .filter())
   * Sử dụng useMemo để tối ưu hiệu năng khi danh sách lớn hoặc re-render
   */
  const danhSachLoc = useMemo(() => {
    if (!searchTerm.trim()) {
      return danhSachSinhVien;
    }

    const keywordNormalized = removeVietnameseTones(searchTerm);

    return danhSachSinhVien.filter((sv) => {
      // Tìm theo họ tên (có hỗ trợ không dấu và có dấu)
      const hoTenNormalized = removeVietnameseTones(sv.hoTen);
      const isMatchName = hoTenNormalized.includes(keywordNormalized);

      // Mở rộng thêm: Tìm theo mã sinh viên
      const isMatchId = sv.maSV.toLowerCase().includes(searchTerm.toLowerCase().trim());

      return isMatchName || isMatchId;
    });
  }, [danhSachSinhVien, searchTerm]);

  return (
    <div className="container py-4">
      {/* Tiêu đề chính của ứng dụng */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark text-uppercase tracking-wide">
          Bài Tập Quản Lý Sinh Viên
        </h2>
        <p className="text-muted">
          Ứng dụng minh họa xử lý Form &amp; Validation kết hợp Redux State Management
        </p>
      </div>

      {/* 1. Component Form nhập liệu sinh viên */}
      <FormSinhVien />

      {/* 2. Thanh công cụ tìm kiếm */}
      <div className="card shadow-sm border-0 mb-3 bg-white">
        <div className="card-body p-3">
          <div className="row align-items-center g-2">
            <div className="col-12 col-md-6 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Tìm kiếm theo tên sinh viên hoặc mã SV..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary border-start-0 border-top border-bottom border-end"
                    type="button"
                    title="Xoá tìm kiếm"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-7 text-md-end text-muted small">
              {searchTerm.trim() ? (
                <span>
                  Tìm thấy <strong>{danhSachLoc.length}</strong> kết quả cho từ khoá{' '}
                  <span className="badge bg-info text-dark">"{searchTerm}"</span>
                </span>
              ) : (
                <span>Nhập tên hoặc mã sinh viên để tìm kiếm nhanh</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Component Bảng hiển thị danh sách sinh viên */}
      <TableSinhVien danhSachHienThi={danhSachLoc} />
    </div>
  );
};
