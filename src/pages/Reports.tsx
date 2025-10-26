import React, { useState, useEffect } from "react";
import { FileText, Download, Filter, Plus } from "lucide-react";
import ReportTable from "../components/ReportTable";
import ReportDetailModal from "../components/ReportDetailModal";
import ReportForm from "../components/ReportForm";
import { reportsAPI } from "../services/api";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getReports();
      if (response.success) {
        setReports(response.data);
      }
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
    setShowForm(true);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleCreateReport = async (reportData) => {
    try {
      const response = await reportsAPI.createReport(reportData);
      if (response.success) {
        setReports((prev) => [...prev, response.data]);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error al crear reporte:", error);
    }
  };

  const handleUpdateReport = async (reportData) => {
    try {
      const response = await reportsAPI.updateReport(
        editingReport.id,
        reportData
      );
      if (response.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === editingReport.id ? response.data : r))
        );
        setShowForm(false);
        setEditingReport(null);
      }
    } catch (error) {
      console.error("Error al actualizar reporte:", error);
    }
  };

  const handleExport = async (format = "pdf") => {
    try {
      const response = await reportsAPI.exportReports(format);
      if (response.success) {
        alert(response.message);
        // En producción, aquí se descargaría el archivo real
      }
    } catch (error) {
      console.error("Error al exportar reportes:", error);
    }
  };

  const filteredReports = reports.filter((report) => {
    return statusFilter === "" || report.estado === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reportes de Proyecto
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Visualiza y gestiona los informes de avance de proyectos
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleExport("pdf")}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Reporte
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {reports.length}
              </div>
              <div className="text-sm text-gray-600">Total Reportes</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {reports.filter((r) => r.estado === "completado").length}
              </div>
              <div className="text-sm text-gray-600">Completados</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {reports.filter((r) => r.estado === "en_revision").length}
              </div>
              <div className="text-sm text-gray-600">En Revisión</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(
                  reports.reduce((sum, r) => sum + r.progreso, 0) /
                    reports.length
                ) || 0}
                %
              </div>
              <div className="text-sm text-gray-600">Progreso Promedio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="completado">Completado</option>
            <option value="en_revision">En Revisión</option>
            <option value="pendiente">Pendiente</option>
          </select>

          <div className="text-sm text-gray-600">
            Mostrando {filteredReports.length} de {reports.length} reportes
          </div>
        </div>
      </div>

      {/* Tabla de reportes */}
      <ReportTable
        reports={filteredReports}
        onEdit={handleEditReport}
        onView={handleViewReport}
      />

      {/* Formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ReportForm
              onSubmit={async (data) => {
                if (editingReport) {
                  await handleUpdateReport(data);
                } else {
                  await handleCreateReport(data);
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingReport(null);
              }}
              initialData={editingReport}
            />
          </div>
        </div>
      )}

      {showDetailModal && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedReport(null);
          }}
        />
      )}
    </div>
  );
};

export default Reports;
