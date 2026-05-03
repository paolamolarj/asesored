import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Asesoria {
  id: number;
  materia: string;
  fecha: string;
  hora: string;
  estado: string;
  asesor_nombre?: string;
  asesor_apellido?: string;
  alumno_nombre?: string;
  alumno_apellido?: string;
}

interface ExportarPDFProps {
  asesorias: Asesoria[];
  nombreUsuario: string;
  rol: "alumno" | "asesor";
}

export default function ExportarPDF({ asesorias, nombreUsuario, rol }: ExportarPDFProps) {
  function getStatusLabel(estado: string) {
    switch (estado) {
      case "confirmada": return "Aceptada";
      case "pendiente": return "Pendiente";
      case "cancelada": return "Cancelada";
      case "completada": return "Completada";
      default: return estado;
    }
  }

  function formatFecha(fecha: string) {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-MX", {
      year: "numeric", month: "long", day: "numeric",
    });
  }

  function formatHora(hora: string) { return hora.slice(0, 5); }

  function handleExportar() {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(29, 78, 216);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("AsesoRed", 14, 16);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Historial de asesorías", 14, 25);

    // Info del usuario
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`${rol === "alumno" ? "Alumno" : "Asesor"}: ${nombreUsuario}`, 14, 48);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado el ${new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}`, 14, 56);
    doc.text(`Total de asesorías: ${asesorias.length}`, 14, 63);

    // Estadísticas rápidas
    const completadas = asesorias.filter((a) => a.estado === "completada").length;
    const pendientes = asesorias.filter((a) => a.estado === "pendiente").length;
    const canceladas = asesorias.filter((a) => a.estado === "cancelada").length;

    doc.setFontSize(9);
    doc.setTextColor(52, 211, 153);
    doc.text(`✓ Completadas: ${completadas}`, 120, 48);
    doc.setTextColor(251, 191, 36);
    doc.text(`⏳ Pendientes: ${pendientes}`, 120, 56);
    doc.setTextColor(248, 113, 113);
    doc.text(`✗ Canceladas: ${canceladas}`, 120, 63);

    // Línea separadora
    doc.setDrawColor(229, 231, 235);
    doc.line(14, 68, 196, 68);

    // Tabla
    const columnas = rol === "alumno"
      ? ["Materia", "Asesor", "Fecha", "Hora", "Estado"]
      : ["Materia", "Alumno", "Fecha", "Hora", "Estado"];

    const filas = asesorias.map((a) => [
      a.materia,
      rol === "alumno"
        ? `${a.asesor_nombre || ""} ${a.asesor_apellido || ""}`.trim()
        : `${a.alumno_nombre || ""} ${a.alumno_apellido || ""}`.trim(),
      formatFecha(a.fecha),
      formatHora(a.hora),
      getStatusLabel(a.estado),
    ]);

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 74,
      styles: {
        fontSize: 9,
        cellPadding: 5,
        font: "helvetica",
      },
      headStyles: {
        fillColor: [29, 78, 216],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        4: {
          fontStyle: "bold",
          halign: "center",
        },
      },
      didDrawCell: (data) => {
        // Colorear celda de estado
        if (data.column.index === 4 && data.section === "body") {
          const estado = asesorias[data.row.index]?.estado;
          if (estado === "completada") data.cell.styles.textColor = [5, 150, 105];
          else if (estado === "pendiente") data.cell.styles.textColor = [217, 119, 6];
          else if (estado === "cancelada") data.cell.styles.textColor = [220, 38, 38];
          else if (estado === "confirmada") data.cell.styles.textColor = [29, 78, 216];
        }
      },
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `AsesoRed · Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    const fecha = new Date().toISOString().split("T")[0];
    doc.save(`historial-asesorias-${fecha}.pdf`);
  }

  if (asesorias.length === 0) return null;

  return (
    <button
      onClick={handleExportar}
      className="btn-sm"
      style={{
        borderColor: "rgba(220,38,38,0.25)",
        background: "rgba(220,38,38,0.08)",
        color: "#FCA5A5",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      📄 Exportar PDF
    </button>
  );
}