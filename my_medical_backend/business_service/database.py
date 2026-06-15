"""
数据库连接和会话管理
使用SQLite作为本地数据库，支持医疗影像报告系统的数据持久化
"""

from sqlmodel import SQLModel, create_engine, Session
import os
from pathlib import Path

# 数据库文件路径 - 存储在项目根目录的data文件夹中
DATABASE_PATH = Path(__file__).parent.parent / "data" / "medical_app.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# 创建数据库引擎
# check_same_thread=False 允许多线程访问SQLite
engine = create_engine(
    DATABASE_URL, 
    echo=True,  # 开发环境显示SQL查询日志，生产环境可设为False
    connect_args={"check_same_thread": False}
)

def init_db():
    """
    初始化数据库，创建所有表
    这个函数会在应用启动时调用
    """
    # 确保data目录存在
    DATABASE_PATH.parent.mkdir(exist_ok=True)
    
    # 创建所有表
    SQLModel.metadata.create_all(engine)
    print(f"✅ 数据库已初始化: {DATABASE_PATH}")

def get_session():
    """
    获取数据库会话的依赖函数
    用于FastAPI的依赖注入
    """
    with Session(engine) as session:
        yield session

# 数据库会话上下文管理器
class DatabaseSession:
    """数据库会话上下文管理器，用于手动管理事务"""
    
    def __init__(self):
        self.session = None
    
    def __enter__(self):
        self.session = Session(engine)
        return self.session
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            # 发生异常时回滚
            self.session.rollback()
        else:
            # 正常情况下提交事务
            self.session.commit()
        self.session.close()

# 便捷函数：执行数据库操作
def execute_with_session(func, *args, **kwargs):
    """
    使用会话执行数据库操作的便捷函数
    
    Args:
        func: 要执行的函数，第一个参数必须是session
        *args, **kwargs: 传递给函数的其他参数
    
    Returns:
        函数执行结果
    """
    with DatabaseSession() as session:
        return func(session, *args, **kwargs)