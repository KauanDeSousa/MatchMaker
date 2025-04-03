import FormTime from '@/templates/Teams/Form/page';

export default function Page({ params }: { params: { value: string } }) {
    return <FormTime params={params} />;
}
