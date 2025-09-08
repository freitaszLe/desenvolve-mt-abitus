import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { postNovaInformacao } from '../../services/api';
import toast from 'react-hot-toast';

const submissionSchema = z.object({
  observacoes: z.string().min(10, { message: "Por favor, detalhe mais sua observação." }),
  dataAvistamento: z.string().refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), { message: "Data inválida." }),
  localizacao: z.string().min(5, { message: "Por favor, informe um local." }),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
interface SubmissionFormProps {
  personName: string;
  ocorrenciaId: number;
  onClose: () => void;
  onSuccess: () => void; 
}

const SubmissionForm = ({ personName, ocorrenciaId, onClose, onSuccess }: SubmissionFormProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, formState: { errors }, control } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const handleFormSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    try {
      const dataComArquivos = {
        ...data,
        foto: selectedFiles, 
      };

      await postNovaInformacao(ocorrenciaId, dataComArquivos as any);
      toast.success(`Informação sobre ${personName} enviada com sucesso!`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Houve um erro ao enviar sua informação.");
      console.error("Erro no envio do formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDateMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) { value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`; }
    else if (value.length > 2) { value = `${value.slice(0, 2)}/${value.slice(2)}`; }
    return value;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles(currentFiles => [...currentFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(currentFiles => currentFiles.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(newPreviewUrls);
    return () => { newPreviewUrls.forEach(url => URL.revokeObjectURL(url)); };
  }, [selectedFiles]);

   return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-dark-card border border-dark-border rounded-lg shadow-xl w-full max-w-lg p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-1">Registrar Nova Informação</h2>
        <p className="text-text-muted mb-6">Sobre: <span className="font-semibold text-text-light">{personName}</span></p>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="observacoes" className="block text-sm font-semibold text-text-muted mb-1">Observações</label>
            <textarea id="observacoes" {...control.register("observacoes")} className="w-full bg-gray-cyber border border-dark-border rounded-md p-2 text-text-light focus:outline-none focus:ring-2 focus:ring-neon-red focus:border-transparent transition" rows={4} placeholder="Ex: Foi visto(a) na Praça Central..."/>
            {errors.observacoes && <p className="text-red-400 text-sm mt-1">{errors.observacoes.message}</p>}
          </div>

          <div>
            <label htmlFor="dataAvistamento" className="block text-sm font-semibold text-text-muted mb-1">Data em que foi visto(a)</label>
            <Controller name="dataAvistamento" control={control} defaultValue="" render={({ field }) => ( <input {...field} onChange={(e) => field.onChange(handleDateMask(e))} id="dataAvistamento" className="w-full bg-gray-cyber border border-dark-border rounded-md p-2 text-text-light focus:outline-none focus:ring-2 focus:ring-neon-red focus:border-transparent transition" placeholder="DD/MM/AAAA"/> )}/>
            {errors.dataAvistamento && <p className="text-red-400 text-sm mt-1">{errors.dataAvistamento.message}</p>}
          </div>

          <div>
            <label htmlFor="localizacao" className="block text-sm font-semibold text-text-muted mb-1">Localização avistada</label>
            <input type="text" id="localizacao" {...control.register("localizacao")} className="w-full bg-gray-cyber border border-dark-border rounded-md p-2 text-text-light focus:outline-none focus:ring-2 focus:ring-neon-red focus:border-transparent transition" placeholder="Ex: Cuiabá, MT, Bairro Centro..."/>
            {errors.localizacao && <p className="text-red-400 text-sm mt-1">{errors.localizacao.message}</p>}
          </div>
          
          <div>
            <label htmlFor="fotos" className="block text-sm font-semibold text-text-muted mb-1">Anexar fotos (opcional)</label>
            <input
              type="file"
              id="fotos"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900/50 file:text-blue-300 hover:file:bg-blue-900 transition"
            />
          </div>

          {previewImages.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-semibold text-text-muted mb-2">Prévia das imagens:</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {previewImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Prévia ${index + 1}`} className="rounded-md object-cover h-20 w-20 border border-dark-border" />
                    <button type="button" onClick={() => handleRemoveFile(index)} className="absolute -top-2 -right-2 bg-neon-red text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold shadow-lg" aria-label="Remover imagem">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          )}


          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-md transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="bg-neon-red hover:bg-neon-red-dark text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50">
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;