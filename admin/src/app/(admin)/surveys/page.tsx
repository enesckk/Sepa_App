'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableColumn } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/ToastProvider';
import { adminService, SurveysResponse } from '@/lib/services/admin';
import { Edit, Trash2, Plus, Download, FileSpreadsheet, Calendar, Gift, FileText } from 'lucide-react';
import { exportToCSV, exportToExcel, prepareTableData } from '@/lib/utils/export';

interface Question {
  id?: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'rating' | 'yes_no';
  options?: string[];
  is_required: boolean;
  order: number;
}

interface Survey {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  golbucks_reward: number;
  expires_at?: string;
  is_active: boolean;
  questions?: Question[];
  created_at: string;
}

export default function SurveysPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft' as 'draft' | 'active' | 'closed' | 'archived',
    golbucks_reward: '0',
    expires_at: '',
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const {
    data: surveysData,
    isLoading,
    isError,
    error,
  } = useQuery<SurveysResponse, Error>({
    queryKey: ['adminSurveys', search, statusFilter],
    queryFn: () => adminService.getSurveys({ search: search || undefined }),
  });

  const surveys = (surveysData?.surveys || []).filter((survey) => {
    if (search && !survey.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter && survey.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminService.createSurvey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSurveys'] });
      showToast('success', 'Anket başarıyla oluşturuldu.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Anket oluşturulurken bir hata oluştu.', error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateSurvey(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSurveys'] });
      showToast('success', 'Anket başarıyla güncellendi.');
      handleCloseModal();
    },
    onError: (error: any) => {
      showToast('error', 'Anket güncellenirken bir hata oluştu.', error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteSurvey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSurveys'] });
      showToast('success', 'Anket başarıyla silindi.');
    },
    onError: (error: any) => {
      showToast('error', 'Anket silinirken bir hata oluştu.', error.message);
    },
  });

  const addQuestionMutation = useMutation({
    mutationFn: ({ surveyId, data }: { surveyId: string; data: any }) =>
      adminService.addQuestion(surveyId, data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['adminSurveys'] });
      showToast('success', 'Soru başarıyla eklendi.');
      setEditingQuestion(null);
      // Refresh questions list
      if (selectedSurvey) {
        try {
          const response = await adminService.getSurveyById(selectedSurvey.id);
          const fullSurvey = (response as any).survey || response;
          setQuestions(fullSurvey?.questions || []);
        } catch (error) {
          // Ignore refresh error
        }
      }
    },
    onError: (error: any) => {
      showToast('error', 'Soru eklenirken bir hata oluştu.', error.message);
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: any }) =>
      adminService.updateQuestion(questionId, data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['adminSurveys'] });
      showToast('success', 'Soru başarıyla güncellendi.');
      setEditingQuestion(null);
      // Refresh questions list
      if (selectedSurvey) {
        try {
          const response = await adminService.getSurveyById(selectedSurvey.id);
          const fullSurvey = (response as any).survey || response;
          setQuestions(fullSurvey?.questions || []);
        } catch (error) {
          // Ignore refresh error
        }
      }
    },
    onError: (error: any) => {
      showToast('error', 'Soru güncellenirken bir hata oluştu.', error.message);
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: string) => adminService.deleteQuestion(questionId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['adminSurveys'] });
      showToast('success', 'Soru başarıyla silindi.');
      // Refresh questions list
      if (selectedSurvey) {
        try {
          const response = await adminService.getSurveyById(selectedSurvey.id);
          const fullSurvey = (response as any).survey || response;
          setQuestions(fullSurvey?.questions || []);
        } catch (error) {
          // Ignore refresh error
        }
      }
    },
    onError: (error: any) => {
      showToast('error', 'Soru silinirken bir hata oluştu.', error.message);
    },
  });

  const handleOpenModal = (survey?: Survey) => {
    if (survey) {
      setSelectedSurvey(survey);
      setFormData({
        title: survey.title,
        description: survey.description || '',
        status: survey.status,
        golbucks_reward: survey.golbucks_reward.toString(),
        expires_at: survey.expires_at ? new Date(survey.expires_at).toISOString().split('T')[0] : '',
      });
      setQuestions(survey.questions || []);
    } else {
      setSelectedSurvey(null);
      setFormData({
        title: '',
        description: '',
        status: 'draft',
        golbucks_reward: '0',
        expires_at: '',
      });
      setQuestions([]);
    }
    setEditingQuestion(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedSurvey(null);
    setQuestions([]);
    setEditingQuestion(null);
  };

  const handleOpenQuestionsModal = async (survey: Survey) => {
    // Fetch full survey with questions
    try {
      const response = await adminService.getSurveyById(survey.id);
      const fullSurvey = (response as any).survey || response;
      setSelectedSurvey(fullSurvey || survey);
      setQuestions(fullSurvey?.questions || survey.questions || []);
      setQuestionsModalOpen(true);
    } catch (error) {
      // Fallback to provided survey data
      setSelectedSurvey(survey);
      setQuestions(survey.questions || []);
      setQuestionsModalOpen(true);
    }
  };

  const handleCloseQuestionsModal = () => {
    setQuestionsModalOpen(false);
    setSelectedSurvey(null);
    setQuestions([]);
    setEditingQuestion(null);
  };

  const handleSubmit = () => {
    if (!formData.title) {
      showToast('error', 'Lütfen başlık ekleyin.');
      return;
    }

    const payload: any = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      golbucks_reward: parseInt(formData.golbucks_reward),
    };

    if (formData.expires_at) {
      payload.expires_at = formData.expires_at;
    }

    if (!selectedSurvey && questions.length > 0) {
      payload.questions = questions.map((q, index) => ({
        text: q.text,
        type: q.type,
        options: q.options || undefined,
        is_required: q.is_required,
        order: q.order !== undefined ? q.order : index,
      }));
    }

    if (selectedSurvey) {
      updateMutation.mutate({ id: selectedSurvey.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu anketi silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  // Export functions
  const handleExportCSV = () => {
    const exportColumns = columns.filter((col) => col.key !== 'actions');
    const { headers, rows } = prepareTableData(surveys, exportColumns);
    exportToCSV({
      filename: 'anketler',
      headers,
      data: rows,
    });
    showToast('success', 'CSV dosyası indirildi.');
  };

  const handleExportExcel = async () => {
    try {
      const exportColumns = columns.filter((col) => col.key !== 'actions');
      const { headers, rows } = prepareTableData(surveys, exportColumns);
      await exportToExcel({
        filename: 'anketler',
        headers,
        data: rows,
      });
      showToast('success', 'Excel dosyası indirildi.');
    } catch (error: any) {
      showToast('error', 'Excel export hatası:', error.message);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion({
      text: '',
      type: 'text',
      is_required: true,
      order: questions.length,
    });
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion || !editingQuestion.text) {
      showToast('error', 'Lütfen soru metnini girin.');
      return;
    }

    if (
      (editingQuestion.type === 'single_choice' || editingQuestion.type === 'multiple_choice') &&
      (!editingQuestion.options || editingQuestion.options.length === 0)
    ) {
      showToast('error', 'Seçenekli sorular için en az bir seçenek ekleyin.');
      return;
    }

    if (!selectedSurvey) {
      showToast('error', 'Anket seçilmedi.');
      return;
    }

    const questionData: any = {
      text: editingQuestion.text,
      type: editingQuestion.type,
      is_required: editingQuestion.is_required,
      order: editingQuestion.order,
    };

    if (editingQuestion.options && editingQuestion.options.length > 0) {
      questionData.options = editingQuestion.options;
    }

    if (editingQuestion.id) {
      updateQuestionMutation.mutate({ questionId: editingQuestion.id, data: questionData });
    } else {
      addQuestionMutation.mutate({ surveyId: selectedSurvey.id, data: questionData });
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
      deleteQuestionMutation.mutate(questionId);
    }
  };

  const columns: TableColumn<Survey>[] = [
    {
      key: 'title',
      header: 'Başlık',
      render: (row) => (
        <div>
          <div style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: '4px',
          }}>
            {row.title}
          </div>
          {row.description && (
            <div style={{
              fontSize: '13px',
              color: '#64748b',
              maxWidth: '300px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Durum',
      render: (row) => {
        const statusConfig: Record<string, { label: string; bg: string; border: string; color: string }> = {
          active: { label: 'Aktif', bg: '#ecfdf5', border: '#d1fae5', color: '#059669' },
          draft: { label: 'Taslak', bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb' },
          closed: { label: 'Kapalı', bg: '#fef3c7', border: '#fde68a', color: '#d97706' },
          archived: { label: 'Arşiv', bg: '#f1f5f9', border: '#e2e8f0', color: '#64748b' },
        };
        const config = statusConfig[row.status] || statusConfig.draft;
        
        return (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            backgroundColor: config.bg,
            borderRadius: '8px',
            border: `1px solid ${config.border}`,
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: config.color,
            }}>
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      key: 'golbucks_reward',
      header: 'Ödül',
      render: (row) => (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: '#ecfdf5',
          borderRadius: '8px',
          border: '1px solid #d1fae5',
        }}>
          <Gift style={{ color: '#10b981' }} size={16} />
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#059669',
          }}>
            {row.golbucks_reward} ₺
          </span>
        </div>
      ),
    },
    {
      key: 'expires_at',
      header: 'Bitiş',
      render: (row) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Calendar style={{ color: '#64748b' }} size={16} />
          <span style={{
            fontSize: '14px',
            color: '#475569',
          }}>
            {row.expires_at
              ? new Date(row.expires_at).toLocaleDateString('tr-TR')
              : 'Süresiz'}
          </span>
        </div>
      ),
    },
    {
      key: 'questions',
      header: 'Sorular',
      render: (row) => (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe',
        }}>
          <FileText style={{ color: '#3b82f6' }} size={16} />
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#2563eb',
          }}>
            {row.questions?.length || 0} soru
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => handleOpenQuestionsModal(row)}
            title="Soruları Yönet"
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              color: '#3b82f6',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dbeafe';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => handleOpenModal(row)}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ecfdf5',
              border: '1px solid #d1fae5',
              borderRadius: '8px',
              color: '#10b981',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d1fae5';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ecfdf5';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    showToast('error', 'Anketler yüklenirken bir hata oluştu.', error.message);
    return (
      <EmptyState
        title="Veriler Yüklenemedi"
        description="Anket listesi alınamadı. Lütfen daha sonra tekrar deneyin."
      />
    );
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px',
      }}>
        <button
          onClick={handleExportCSV}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#ffffff',
            border: '1px solid #10b981',
            borderRadius: '10px',
            color: '#10b981',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ecfdf5';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Download size={16} />
          CSV
        </button>
        <button
          onClick={handleExportExcel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#10b981',
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
          }}
        >
          <FileSpreadsheet size={16} />
          Excel
        </button>
        <button
          onClick={() => handleOpenModal()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
          }}
        >
          Yeni Anket
        </button>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #d1fae5',
        padding: '24px',
        background: 'linear-gradient(to bottom, #ffffff, #f0fdf4)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          <Input
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { label: 'Durum: Tümü', value: '' },
              { label: 'Taslak', value: 'draft' },
              { label: 'Aktif', value: 'active' },
              { label: 'Kapalı', value: 'closed' },
              { label: 'Arşiv', value: 'archived' },
            ]}
          />
        </div>
      </div>

      <Table<Survey>
        columns={columns}
        data={surveys}
        loading={isLoading}
        emptyState={<EmptyState description="Henüz anket eklenmedi." />}
      />

      {/* Create/Edit Survey Modal */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        title={selectedSurvey ? 'Anket Düzenle' : 'Yeni Anket'}
        footer={
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}>
            <button
              onClick={handleCloseModal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              style={{
                padding: '10px 20px',
                backgroundColor: createMutation.isPending || updateMutation.isPending ? '#94a3b8' : '#10b981',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: createMutation.isPending || updateMutation.isPending ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (!createMutation.isPending && !updateMutation.isPending) {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!createMutation.isPending && !updateMutation.isPending) {
                  e.currentTarget.style.backgroundColor = '#10b981';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
                }
              }}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Kaydediliyor...' : (selectedSurvey ? 'Güncelle' : 'Oluştur')}
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="Başlık *"
            placeholder="Anket başlığı"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            label="Açıklama"
            placeholder="Kısa açıklama"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Durum"
              value={formData.status}
              onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              options={[
                { label: 'Taslak', value: 'draft' },
                { label: 'Aktif', value: 'active' },
                { label: 'Kapalı', value: 'closed' },
                { label: 'Arşiv', value: 'archived' },
              ]}
            />
            <Input
              label="Gölbucks Ödülü"
              type="number"
              placeholder="10"
              value={formData.golbucks_reward}
              onChange={(e) => setFormData({ ...formData, golbucks_reward: e.target.value })}
            />
            <Input
              label="Bitiş Tarihi"
              type="date"
              value={formData.expires_at}
              onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
            />
          </div>
          {!selectedSurvey && (
            <div className="mt-4 p-3 bg-background rounded-lg border border-border">
              <p className="text-sm text-text-secondary mb-2">
                Soruları anket oluşturduktan sonra ekleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Questions Management Modal */}
      <Modal
        open={questionsModalOpen}
        onClose={handleCloseQuestionsModal}
        title={`Sorular - ${selectedSurvey?.title}`}
        widthClass="max-w-4xl"
        footer={
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}>
            <button
              onClick={handleCloseQuestionsModal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              Kapat
            </button>
            <button
              onClick={handleAddQuestion}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.2)';
              }}
            >
              <Plus size={16} />
              Yeni Soru
            </button>
          </div>
        }
      >
        {editingQuestion ? (
          <QuestionForm
            question={editingQuestion}
            onChange={(q) => setEditingQuestion(q)}
            onSave={handleSaveQuestion}
            onCancel={() => setEditingQuestion(null)}
            loading={addQuestionMutation.isPending || updateQuestionMutation.isPending}
          />
        ) : (
          <div className="space-y-4">
            {selectedSurvey && (
              <div className="p-4 bg-background rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{selectedSurvey.title}</div>
                    <div className="text-sm text-text-secondary">
                      {selectedSurvey.questions?.length || 0} soru
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {questions.map((question, index) => (
                <div
                  key={question.id || index}
                  className="p-4 bg-background rounded-lg border border-border flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-text-secondary">
                        {index + 1}.
                      </span>
                      <span className="font-medium">{question.text}</span>
                      <Badge variant="info" className="ml-2">
                        {question.type === 'single_choice'
                          ? 'Tek Seçim'
                          : question.type === 'multiple_choice'
                          ? 'Çoklu Seçim'
                          : question.type === 'text'
                          ? 'Metin'
                          : question.type === 'number'
                          ? 'Sayı'
                          : question.type === 'rating'
                          ? 'Değerlendirme'
                          : 'Evet/Hayır'}
                      </Badge>
                      {question.is_required && (
                        <Badge variant="warning" className="ml-1">
                          Zorunlu
                        </Badge>
                      )}
                    </div>
                    {question.options && question.options.length > 0 && (
                      <div className="text-sm text-text-secondary ml-6">
                        Seçenekler: {question.options.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuestion(question)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {question.id && (
                      <Button
                        variant="dangerGhost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {questions.length === 0 && (
                <EmptyState description="Henüz soru eklenmedi." />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Question Form Component
function QuestionForm({
  question,
  onChange,
  onSave,
  onCancel,
  loading,
}: {
  question: Question;
  onChange: (q: Question) => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [optionsText, setOptionsText] = useState(
    question.options ? question.options.join('\n') : ''
  );

  const handleOptionsChange = (text: string) => {
    setOptionsText(text);
    const options = text
      .split('\n')
      .map((o) => o.trim())
      .filter((o) => o.length > 0);
    onChange({ ...question, options: options.length > 0 ? options : undefined });
  };

  return (
    <div className="space-y-4">
      <Textarea
        label="Soru Metni *"
        placeholder="Soruyu buraya yazın"
        rows={2}
        value={question.text}
        onChange={(e) => onChange({ ...question, text: e.target.value })}
      />
      <Select
        label="Soru Tipi *"
        value={question.type}
        onValueChange={(value: any) => onChange({ ...question, type: value })}
        options={[
          { label: 'Metin', value: 'text' },
          { label: 'Sayı', value: 'number' },
          { label: 'Tek Seçim (Radio)', value: 'single_choice' },
          { label: 'Çoklu Seçim (Checkbox)', value: 'multiple_choice' },
          { label: 'Değerlendirme (1-5)', value: 'rating' },
          { label: 'Evet/Hayır', value: 'yes_no' },
        ]}
      />
      {(question.type === 'single_choice' || question.type === 'multiple_choice') && (
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Seçenekler (Her satıra bir seçenek) *
          </label>
          <Textarea
            placeholder="Seçenek 1&#10;Seçenek 2&#10;Seçenek 3"
            rows={4}
            value={optionsText}
            onChange={(e) => handleOptionsChange(e.target.value)}
          />
          <p className="mt-1 text-sm text-text-secondary">
            Her satıra bir seçenek yazın
          </p>
        </div>
      )}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={question.is_required}
            onChange={(e) => onChange({ ...question, is_required: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-sm text-text">Zorunlu soru</span>
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          İptal
        </Button>
        <Button onClick={onSave} loading={loading}>
          {question.id ? 'Güncelle' : 'Ekle'}
        </Button>
      </div>
    </div>
  );
}
