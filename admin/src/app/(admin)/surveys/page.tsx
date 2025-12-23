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
import { Edit, Trash2, Plus } from 'lucide-react';

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
          <div className="font-medium">{row.title}</div>
          {row.description && (
            <div className="text-sm text-text-secondary line-clamp-1">{row.description}</div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Durum',
      render: (row) => (
        <Badge
          variant={
            row.status === 'active'
              ? 'success'
              : row.status === 'draft'
              ? 'info'
              : row.status === 'closed'
              ? 'warning'
              : 'default'
          }
        >
          {row.status === 'active'
            ? 'Aktif'
            : row.status === 'draft'
            ? 'Taslak'
            : row.status === 'closed'
            ? 'Kapalı'
            : 'Arşiv'}
        </Badge>
      ),
    },
    {
      key: 'golbucks_reward',
      header: 'Ödül',
      render: (row) => <span className="font-semibold text-green-600">{row.golbucks_reward} ₺</span>,
    },
    {
      key: 'expires_at',
      header: 'Bitiş',
      render: (row) => (
        <div>
          {row.expires_at
            ? new Date(row.expires_at).toLocaleDateString('tr-TR')
            : 'Süresiz'}
        </div>
      ),
    },
    {
      key: 'questions',
      header: 'Sorular',
      render: (row) => (
        <div className="text-sm text-text-secondary">
          {row.questions?.length || 0} soru
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenQuestionsModal(row)}
            title="Soruları Yönet"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="dangerGhost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Anketler</h1>
          <p className="text-text-secondary text-sm mt-1">
            Anketleri yönetin, soru ekleyin.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>Yeni Anket</Button>
      </div>

      <div className="bg-surface rounded-card shadow-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {selectedSurvey ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
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
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleCloseQuestionsModal}>
              Kapat
            </Button>
            <Button onClick={handleAddQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Soru
            </Button>
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
