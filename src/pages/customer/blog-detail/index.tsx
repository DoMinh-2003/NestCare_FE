import useBlogService from '../../../services/useBlogService'
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Typography, Card, Avatar, Tag, Skeleton, Space, Divider, Row, Col, Image, List } from "antd"
import { CalendarOutlined, UserOutlined, TagOutlined } from "@ant-design/icons"
import { formatDate } from '../../../utils/formatDate'
import moment from 'moment'

const { Title, Paragraph, Text } = Typography

const BlogDetail = () => {
    const { getBlog } = useBlogService();
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams();
    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            const blogData = await getBlog(id!);
            setBlog(blogData.data)
            setLoading(false);
        }
        fetchBlog();
    }, [id])
    if (loading) {
        return <BlogDetailSkeleton />
    }

    const commentsData = [
        {
            author: "Minh Tran",
            avatar: null,
            content: "Bài viết rất hay, cảm ơn bạn đã chia sẻ!",
            datetime: moment().subtract(2, "hours").fromNow(),
            replies: [
                {
                    author: "Lan Pham",
                    avatar: null,
                    content: "Đúng rồi, đoạn nói về JavaFX mình chưa biết luôn.",
                    datetime: moment().subtract(90, "minutes").fromNow(),
                },
            ],
        },
        {
            author: "Tu Nguyen",
            avatar: null,
            content: "Mình nghĩ bạn nên thêm ví dụ thực tế với Spring Boot nữa sẽ tuyệt hơn.",
            datetime: moment().subtract(3, "hours").fromNow(),
            replies: [
                {
                    author: "Author",
                    avatar: null,
                    content: "Cảm ơn bạn nhé! Mình sẽ cập nhật trong bài sau.",
                    datetime: moment().subtract(2, "hours").fromNow(),
                },
            ],
        },
        {
            author: "Duy Hoang",
            avatar: null,
            content: "Có ai biết cách chạy đoạn HelloWorld này trên Mac không?",
            datetime: moment().subtract(1, "hour").fromNow(),
            replies: [
                {
                    author: "Lan Pham",
                    avatar: null,
                    content: "Chỉ cần cài JDK rồi chạy bằng terminal với `javac` và `java` là được nha.",
                    datetime: moment().subtract(30, "minutes").fromNow(),
                },
            ],
        },
    ];
    if (!blog) {
        return (
            <Row justify="center" style={{ padding: "40px 0" }}>
                <Col xs={22} sm={20} md={18} lg={16} xl={14}>
                    <Card>
                        <div style={{ textAlign: "center" }}>
                            <Title level={2}>Blog không tìm thấy</Title>
                            <Paragraph type="secondary">
                                Blog bạn tìm không thấy hoặc đã bị gỡ.
                            </Paragraph>
                        </div>
                    </Card>
                </Col>
            </Row>
        )
    }

    const CommentSection = () => {
        return (
            <div style={{ marginTop: 48 }}>
                <Title level={3}>Bình luận</Title>
                {commentsData.map((comment) => (
                    <Card
                        key={comment.id}
                        style={{ marginBottom: 16, backgroundColor: "#fafafa", borderRadius: 8 }}
                    >
                        <Space align="start">
                            <Avatar icon={<UserOutlined />} src={comment.avatar} />
                            <div>
                                <Text strong>{comment.author}</Text>
                                <Paragraph style={{ marginBottom: 4 }}>{comment.content}</Paragraph>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {comment.datetime}
                                </Text>

                                {/* Replies */}
                                {comment.replies?.length > 0 && (
                                    <div style={{ marginTop: 12, paddingLeft: 32, borderLeft: "2px solid #eee" }}>
                                        {comment.replies.map((reply) => (
                                            <div key={reply.id} style={{ marginBottom: 12 }}>
                                                <Space align="start">
                                                    <Avatar icon={<UserOutlined />} src={reply.avatar} size="small" />
                                                    <div>
                                                        <Text strong>{reply.author}</Text>
                                                        <Paragraph style={{ marginBottom: 4 }}>{reply.content}</Paragraph>
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            {reply.datetime}
                                                        </Text>
                                                    </div>
                                                </Space>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Space>
                    </Card>
                ))}

                <Divider />
            </div>
        );
    };



    return (
        <Row justify="center" style={{ padding: "40px 0" }}>
            <Col xs={22} sm={20} md={18} lg={16} xl={14}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <Title level={1} style={{ marginBottom: 16 }}>
                        {blog.title}
                    </Title>

                    <Space split={<Divider type="vertical" />} wrap style={{ marginBottom: 16 }}>
                        <Space>
                            <CalendarOutlined />
                            <Text type="secondary">{formatDate(blog.createdAt)}</Text>
                        </Space>
                        {blog.category && (
                            <Space>
                                <TagOutlined />
                                <Tag color="blue">{blog.category}</Tag>
                            </Space>
                        )}
                    </Space>

                    {/* Author */}
                    {blog.author && (
                        <Space style={{ marginBottom: 24 }}>
                            <Avatar src={blog.author.avatar} size="large" icon={<UserOutlined />} />
                            <div>
                                <Text type="secondary">Written by</Text>
                                <div>{blog.author.name}</div>
                            </div>
                        </Space>
                    )}
                </div>

                {/* Featured Image */}
                {blog.image && (
                    <div style={{ marginBottom: 24 }}>
                        <Image
                            src={blog.image || "https://picsum.photos/id/237/200/300"}
                            alt={blog.title}
                            style={{ width: "100%", borderRadius: 8 }}
                            preview={false}
                        />
                    </div>
                )}

                {/* Description */}

                <Card style={{ marginBottom: 24 }}>
                    <Paragraph italic type="secondary" style={{ fontSize: 16 }}>
                        {blog.description}
                    </Paragraph>
                </Card>

                {/* Content */}
                <Card>
                    <Typography>
                        <Title level={2}>Introduction to Java Programming</Title>
                        <Paragraph>
                            Java is a high-level, class-based, object-oriented programming language that is designed to have as few
                            implementation dependencies as possible. It is a general-purpose programming language intended to let
                            application developers write once, run anywhere (WORA), meaning that compiled Java code can run on all
                            platforms that support Java without the need for recompilation.
                        </Paragraph>

                        <Title level={3}>Key Features of Java</Title>
                        <ul>
                            <li>
                                Platform Independence: Java code runs on any device that has the Java Virtual Machine (JVM) installed.
                            </li>
                            <li>Object-Oriented: Java is based on the concept of objects, which contain data and methods.</li>
                            <li>Rich Standard Library: Java comes with a comprehensive set of libraries and frameworks.</li>
                            <li>Automatic Memory Management: Java handles memory allocation and deallocation automatically.</li>
                            <li>Multi-threading: Java supports concurrent programming through its built-in support for threads.</li>
                        </ul>

                        <Title level={3}>Getting Started with Java</Title>
                        <Paragraph>
                            To start programming in Java, you need to install the Java Development Kit (JDK). The JDK includes the
                            Java Runtime Environment (JRE), which is needed to run Java applications, as well as development tools
                            like the Java compiler.
                        </Paragraph>

                        <Paragraph>Here's a simple "Hello World" program in Java:</Paragraph>

                        <pre style={{ backgroundColor: "#f5f5f5", padding: 16, borderRadius: 4 }}>
                            <code>{`public class HelloWorld {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }`}</code>
                        </pre>

                        <Paragraph>
                            This program defines a class called HelloWorld with a main method that prints "Hello, World!" to the
                            console.
                        </Paragraph>

                        <Title level={3}>Java Ecosystem</Title>
                        <Paragraph>
                            Java has a rich ecosystem of frameworks and libraries that make it suitable for various types of
                            applications:
                        </Paragraph>

                        <ul>
                            <li>Spring Framework: For building enterprise applications</li>
                            <li>Hibernate: For object-relational mapping</li>
                            <li>JavaFX: For building desktop applications</li>
                            <li>Android SDK: For mobile app development</li>
                            <li>Apache Hadoop: For big data processing</li>
                        </ul>

                        <Paragraph>
                            With its robust features and extensive ecosystem, Java continues to be one of the most popular
                            programming languages in the world.
                        </Paragraph>
                    </Typography>
                </Card>
                <CommentSection />
            </Col>
        </Row>
    )


    function BlogDetailSkeleton() {
        return (
            <Row justify="center" style={{ padding: "40px 0" }}>
                <Col xs={22} sm={20} md={18} lg={16} xl={14}>
                    <div style={{ marginBottom: 24 }}>
                        <Skeleton.Input style={{ width: "75%", height: 40 }} active />
                        <div style={{ display: "flex", gap: 16, marginTop: 16, marginBottom: 16 }}>
                            <Skeleton.Input style={{ width: 120 }} active />
                            <Skeleton.Input style={{ width: 120 }} active />
                            <Skeleton.Input style={{ width: 80 }} active />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                            <Skeleton.Avatar active size="large" />
                            <div>
                                <Skeleton.Input style={{ width: 100 }} active />
                                <Skeleton.Input style={{ width: 150, marginTop: 8 }} active />
                            </div>
                        </div>
                    </div>

                    <Skeleton.Image style={{ width: "100%", height: 400 }} active />

                    <div style={{ marginTop: 24 }}>
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </div>
                </Col>
            </Row>
        )
    }
}

export default BlogDetail